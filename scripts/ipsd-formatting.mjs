function targetRange(tab, target) {
  if (!target.managedRangeName) {
    const endIndex = Math.max(1, ...(tab.body?.content ?? []).map((element) => element.endIndex ?? 1));
    return { startIndex: 1, endIndex };
  }

  const entry = tab.namedRanges?.[target.managedRangeName];
  const ranges = entry?.namedRanges?.flatMap((namedRange) => namedRange.ranges ?? []) ?? [];
  if (ranges.length !== 1) {
    throw new Error(`Expected one ${target.managedRangeName} range in ${target.tabId}`);
  }
  return ranges[0];
}

function namedStyleMap(tab) {
  return new Map((tab.namedStyles?.styles ?? []).map((style) => [style.namedStyleType, style]));
}

function effectiveTextStyle(tab, paragraph, element) {
  const styles = namedStyleMap(tab);
  const normal = styles.get("NORMAL_TEXT")?.textStyle ?? {};
  const named = styles.get(paragraph.paragraphStyle?.namedStyleType ?? "NORMAL_TEXT")?.textStyle ?? {};
  const direct = element.textRun?.textStyle ?? element.richLink?.textStyle ?? {};
  return { ...normal, ...named, ...direct };
}

function fontFamily(style) {
  return style.weightedFontFamily?.fontFamily ?? style.fontFamily;
}

function sameRgbColor(actual, expected) {
  const rgb = actual?.color?.rgbColor ?? actual?.rgbColor;
  return ["red", "green", "blue"].every((channel) =>
    Math.abs((rgb?.[channel] ?? 0) - (expected?.[channel] ?? 0)) < 0.000001);
}

function textBearingElements(paragraph) {
  return (paragraph.elements ?? []).filter((element) => {
    const text = element.textRun?.content;
    return (typeof text === "string" && text.replace(/\n/g, "").length > 0) || element.richLink;
  });
}

function hasVisibleContent(paragraph) {
  return (paragraph.elements ?? []).some((element) =>
    element.richLink || (element.textRun?.content ?? "").replace(/\s/g, "").length > 0);
}

function expectedParagraphRoles(target) {
  const roles = [];
  if (target.mode === "verify-only" && typeof target.parityText === "string") {
    roles.push({
      namedStyleType: "HEADING_2",
      fontSizeKey: "heading2FontSizePt",
      bold: true,
      italic: false,
      listKind: null,
    });
  }
  for (const block of target.blocks ?? []) {
    let role = {
      namedStyleType: "NORMAL_TEXT",
      fontSizeKey: "bodyFontSizePt",
      bold: false,
      italic: false,
      listKind: null,
      boldPrefixLength: 0,
      blockType: block.type,
    };
    if (block.type === "title") {
      role = { ...role, namedStyleType: "TITLE", fontSizeKey: "titleFontSizePt", bold: true };
    } else if (block.type === "heading") {
      const level = Math.max(1, Math.min(3, block.level ?? 1));
      role = {
        ...role,
        namedStyleType: `HEADING_${level}`,
        fontSizeKey: `heading${level}FontSizePt`,
        bold: true,
      };
    } else if (block.type === "bullet" || block.type === "numbered") {
      role = { ...role, listKind: block.type };
    } else if (block.type === "paragraph" && block.emphasis) {
      role = { ...role, italic: true };
    } else if (block.type === "quote" || block.type === "signature") {
      role = { ...role, italic: true };
    }
    if (block.type === "link") role = { ...role, boldPrefixLength: block.label.length };
    if (block.type === "quote") role = { ...role, boldPrefixLength: `${block.label}:`.length };
    if (block.type === "callout") {
      role = { ...role, boldPrefixLength: `${block.status} — ${block.title}:`.length };
    }
    if (block.type === "command") {
      role = { ...role, boldPrefixLength: `${block.command} — ${block.label}:`.length };
    }
    const lineCount = typeof block.text === "string"
      ? block.text.split("\n").filter((line) => line.trim()).length
      : 1;
    for (let index = 0; index < lineCount; index += 1) {
      roles.push({
        ...role,
        listKind: index === 0 ? role.listKind : null,
        boldPrefixLength: index === 0 ? role.boldPrefixLength : 0,
      });
    }
  }
  return roles;
}

function managedParagraphs(tab, target) {
  const range = targetRange(tab, target);
  return (tab.body?.content ?? [])
    .filter((element) => element.paragraph &&
      (element.endIndex ?? 0) > range.startIndex &&
      (element.startIndex ?? 0) < range.endIndex &&
      hasVisibleContent(element.paragraph));
}

function listKind(tab, paragraph) {
  const listId = paragraph.bullet?.listId;
  if (!listId) return null;
  const level = paragraph.bullet?.nestingLevel ?? 0;
  const definition = tab.lists?.[listId]?.listProperties?.nestingLevels?.[level];
  if (definition?.glyphSymbol) return "bullet";
  if (definition?.glyphType || definition?.glyphFormat) return "numbered";
  return "unknown";
}

function expectedBoldSegments(paragraph, child, role, paragraphStartIndex) {
  const startIndex = child?.startIndex ?? paragraphStartIndex;
  const endIndex = child?.endIndex ?? startIndex;
  if (role.bold) return [{ startIndex, endIndex, expected: true }];
  if (role.blockType === "link") {
    const hasNativeRichLink = (paragraph.elements ?? []).some((element) => element.richLink);
    if (hasNativeRichLink) {
      return [{ startIndex, endIndex, expected: Boolean(child?.richLink) }];
    }
  }
  const prefixEndIndex = paragraphStartIndex + role.boldPrefixLength;
  const segments = [];
  if (startIndex < prefixEndIndex) {
    segments.push({
      startIndex,
      endIndex: Math.min(endIndex, prefixEndIndex),
      expected: true,
    });
  }
  if (endIndex > prefixEndIndex) {
    segments.push({
      startIndex: Math.max(startIndex, prefixEndIndex),
      endIndex,
      expected: false,
    });
  }
  return segments.filter((segment) => segment.startIndex < segment.endIndex);
}

export function validateFormattingProfile(formatting) {
  if (!formatting || typeof formatting !== "object") throw new Error("Missing IPSD formatting profile");
  if (typeof formatting.profileId !== "string" || !formatting.profileId) {
    throw new Error("IPSD formatting profile needs a profileId");
  }
  if (typeof formatting.fontFamily !== "string" || !formatting.fontFamily) {
    throw new Error("IPSD formatting profile needs a fontFamily");
  }
  for (const field of [
    "bodyFontSizePt",
    "bodyLineSpacing",
    "titleLineSpacing",
    "headingLineSpacing",
    "titleFontSizePt",
    "heading1FontSizePt",
    "heading2FontSizePt",
    "heading3FontSizePt",
  ]) {
    if (!Number.isFinite(formatting[field]) || formatting[field] <= 0) {
      throw new Error(`IPSD formatting profile has invalid ${field}`);
    }
  }
  if (formatting.heading1Border?.widthPt !== 3) {
    throw new Error("The Root template H1 rule must remain the branded 3pt border");
  }
  return formatting;
}

export function formattingIssues(tab, target, formatting) {
  validateFormattingProfile(formatting);
  const range = targetRange(tab, target);
  const issues = [];

  for (const element of tab.body?.content ?? []) {
    if (!element.paragraph || (element.endIndex ?? 0) <= range.startIndex ||
        (element.startIndex ?? 0) >= range.endIndex) continue;

    const paragraph = element.paragraph;
    const namedStyleType = paragraph.paragraphStyle?.namedStyleType ?? "NORMAL_TEXT";
    const expectedSize = {
      NORMAL_TEXT: formatting.bodyFontSizePt,
      TITLE: formatting.titleFontSizePt,
      HEADING_1: formatting.heading1FontSizePt,
      HEADING_2: formatting.heading2FontSizePt,
      HEADING_3: formatting.heading3FontSizePt,
    }[namedStyleType];
    if (!expectedSize) continue;

    for (const child of textBearingElements(paragraph)) {
      const effective = effectiveTextStyle(tab, paragraph, child);
      const actualSize = effective.fontSize?.magnitude;
      const actualFamily = fontFamily(effective);
      if (actualSize !== expectedSize) {
        issues.push({
          kind: "font-size",
          startIndex: child.startIndex ?? element.startIndex,
          endIndex: child.endIndex ?? element.endIndex,
          namedStyleType,
          expected: expectedSize,
          actual: actualSize ?? null,
          fontSizePt: expectedSize,
        });
      }
      if (actualFamily !== formatting.fontFamily) {
        issues.push({
          kind: "font-family",
          startIndex: child.startIndex ?? element.startIndex,
          endIndex: child.endIndex ?? element.endIndex,
          namedStyleType,
          expected: formatting.fontFamily,
          actual: actualFamily ?? null,
          fontSizePt: expectedSize,
        });
      }
    }

    if (namedStyleType === "HEADING_1") {
      const border = paragraph.paragraphStyle?.borderBottom ??
        namedStyleMap(tab).get("HEADING_1")?.paragraphStyle?.borderBottom;
      if (border?.width?.magnitude !== formatting.heading1Border.widthPt ||
          !sameRgbColor(border?.color, formatting.heading1Border.color)) {
        issues.push({
          kind: "heading1-border",
          startIndex: element.startIndex,
          endIndex: element.endIndex,
          namedStyleType,
          expected: formatting.heading1Border.widthPt,
          actual: border?.width?.magnitude ?? null,
        });
      }
    }
  }

  const paragraphs = managedParagraphs(tab, target);
  const roles = expectedParagraphRoles(target);
  if (paragraphs.length !== roles.length) {
    issues.push({
      kind: "paragraph-role-count",
      startIndex: range.startIndex,
      endIndex: range.endIndex,
      expected: roles.length,
      actual: paragraphs.length,
    });
  } else {
    for (let index = 0; index < roles.length; index += 1) {
      const role = roles[index];
      const paragraph = paragraphs[index].paragraph;
      const actualNamedStyle = paragraph.paragraphStyle?.namedStyleType ?? "NORMAL_TEXT";
      if (actualNamedStyle !== role.namedStyleType) {
        issues.push({
          kind: "paragraph-role",
          startIndex: paragraphs[index].startIndex,
          endIndex: paragraphs[index].endIndex,
          expected: role.namedStyleType,
          actual: actualNamedStyle,
          paragraphIndex: index,
        });
      }
      const expectedSpacing = role.namedStyleType === "NORMAL_TEXT"
        ? formatting.bodyLineSpacing
        : role.namedStyleType === "TITLE"
          ? formatting.titleLineSpacing
          : formatting.headingLineSpacing;
      const actualSpacing = paragraph.paragraphStyle?.lineSpacing ??
        namedStyleMap(tab).get(actualNamedStyle)?.paragraphStyle?.lineSpacing;
      if (actualSpacing !== expectedSpacing) {
        issues.push({
          kind: "line-spacing",
          startIndex: paragraphs[index].startIndex,
          endIndex: paragraphs[index].endIndex,
          namedStyleType: role.namedStyleType,
          expected: expectedSpacing,
          actual: actualSpacing ?? null,
          lineSpacing: expectedSpacing,
          paragraphIndex: index,
        });
      }
      const actualKind = listKind(tab, paragraphs[index].paragraph);
      if (actualKind !== role.listKind) {
        issues.push({
          kind: "list-role",
          startIndex: paragraphs[index].startIndex,
          endIndex: paragraphs[index].endIndex,
          expected: role.listKind ?? "none",
          actual: actualKind ?? "none",
          paragraphIndex: index,
        });
      }
      for (const child of textBearingElements(paragraph)) {
        const effective = effectiveTextStyle(tab, paragraph, child);
        const boldSegments = expectedBoldSegments(
          paragraph,
          child,
          role,
          paragraphs[index].startIndex,
        );
        for (const segment of boldSegments) {
          if ((effective.bold ?? false) !== segment.expected) {
            issues.push({
              kind: "bold",
              startIndex: segment.startIndex,
              endIndex: segment.endIndex,
              expected: segment.expected,
              actual: effective.bold ?? false,
              paragraphIndex: index,
            });
          }
        }
        if ((effective.italic ?? false) !== role.italic) {
          issues.push({
            kind: "italic",
            startIndex: child.startIndex ?? paragraphs[index].startIndex,
            endIndex: child.endIndex ?? paragraphs[index].endIndex,
            expected: role.italic,
            actual: effective.italic ?? false,
            paragraphIndex: index,
          });
        }
        for (const segment of boldSegments.filter((candidate) =>
          role.blockType === "link" && candidate.expected)) {
          if ((effective.underline ?? false) !== formatting.link.underline ||
              !sameRgbColor(effective.foregroundColor, formatting.link.color)) {
            issues.push({
              kind: "link-style",
              startIndex: segment.startIndex,
              endIndex: segment.endIndex,
              expected: "branded-link",
              actual: "mismatch",
              paragraphIndex: index,
            });
          }
        }
      }
    }
  }

  return issues;
}

function mergeRanges(ranges) {
  const sorted = [...ranges].sort((a, b) => a.startIndex - b.startIndex || a.endIndex - b.endIndex);
  const merged = [];
  for (const range of sorted) {
    const previous = merged.at(-1);
    if (previous && range.startIndex <= previous.endIndex) {
      previous.endIndex = Math.max(previous.endIndex, range.endIndex);
    } else {
      merged.push({ ...range });
    }
  }
  return merged;
}

export function buildFormattingRepairRequests(tab, target, formatting) {
  const issues = formattingIssues(tab, target, formatting);
  const fontGroups = new Map();
  const paragraphs = managedParagraphs(tab, target);
  const roles = expectedParagraphRoles(target);
  for (const issue of issues.filter((candidate) =>
    candidate.kind === "font-size" || candidate.kind === "font-family")) {
    const paragraphIndex = paragraphs.findIndex((paragraph) =>
      (paragraph.endIndex ?? 0) > issue.startIndex &&
      (paragraph.startIndex ?? 0) < issue.endIndex);
    const role = roles[paragraphIndex];
    if (!role) throw new Error(`Cannot resolve formatting role for ${target.expectedTitle} at ${issue.startIndex}`);
    const paragraph = paragraphs[paragraphIndex];
    const child = paragraph.paragraph.elements?.find((element) =>
      (element.endIndex ?? 0) > issue.startIndex &&
      (element.startIndex ?? 0) < issue.endIndex);
    const boldSegments = expectedBoldSegments(
      paragraph.paragraph,
      child,
      role,
      paragraph.startIndex,
    ).map((segment) => ({
      ...segment,
      startIndex: Math.max(segment.startIndex, issue.startIndex),
      endIndex: Math.min(segment.endIndex, issue.endIndex),
    })).filter((segment) => segment.startIndex < segment.endIndex);
    for (const segment of boldSegments) {
      const key = JSON.stringify({
        fontSizePt: issue.fontSizePt,
        bold: segment.expected,
        italic: role.italic,
      });
      const group = fontGroups.get(key) ?? {
        fontSizePt: issue.fontSizePt,
        bold: segment.expected,
        italic: role.italic,
        ranges: [],
      };
      group.ranges.push({ startIndex: segment.startIndex, endIndex: segment.endIndex });
      fontGroups.set(key, group);
    }
  }
  const spacingGroups = new Map();
  for (const issue of issues.filter((candidate) => candidate.kind === "line-spacing")) {
    const ranges = spacingGroups.get(issue.lineSpacing) ?? [];
    ranges.push({ startIndex: issue.startIndex, endIndex: issue.endIndex });
    spacingGroups.set(issue.lineSpacing, ranges);
  }

  const listIssues = issues.filter((issue) => issue.kind === "list-role");
  const listRequests = [];
  if (listIssues.length) {
    const range = targetRange(tab, target);
    listRequests.push({
      deleteParagraphBullets: {
        range: { ...range, tabId: target.tabId },
      },
    });
    if (paragraphs.length !== roles.length) {
      throw new Error(`Cannot repair list roles in ${target.expectedTitle}: paragraph count differs from payload`);
    }
    let runStart = null;
    let runKind = null;
    for (let index = 0; index <= roles.length; index += 1) {
      const nextKind = roles[index]?.listKind ?? null;
      if (nextKind === runKind) continue;
      if (runKind) {
        listRequests.push({
          createParagraphBullets: {
            range: {
              startIndex: paragraphs[runStart].startIndex,
              endIndex: paragraphs[index - 1].endIndex,
              tabId: target.tabId,
            },
            bulletPreset: runKind === "bullet"
              ? "BULLET_DISC_CIRCLE_SQUARE"
              : "NUMBERED_DECIMAL_ALPHA_ROMAN",
          },
        });
      }
      runStart = nextKind ? index : null;
      runKind = nextKind;
    }
  }

  const roleIssueKinds = new Set(["paragraph-role", "heading1-border"]);
  const roleRequests = [];
  if (issues.some((issue) => roleIssueKinds.has(issue.kind))) {
    if (paragraphs.length !== roles.length) {
      throw new Error(`Cannot repair paragraph roles in ${target.expectedTitle}: paragraph count differs from payload`);
    }
    const repairByIndex = new Map();
    for (const issue of issues.filter((candidate) => roleIssueKinds.has(candidate.kind))) {
      const index = Number.isInteger(issue.paragraphIndex)
        ? issue.paragraphIndex
        : paragraphs.findIndex((paragraph) =>
            paragraph.startIndex === issue.startIndex && paragraph.endIndex === issue.endIndex);
      if (index < 0) continue;
      const kinds = repairByIndex.get(index) ?? new Set();
      kinds.add(issue.kind);
      repairByIndex.set(index, kinds);
    }
    for (const [index, issueKinds] of repairByIndex) {
      const role = roles[index];
      const range = {
        startIndex: paragraphs[index].startIndex,
        endIndex: paragraphs[index].endIndex,
        tabId: target.tabId,
      };
      const paragraphStyle = {
        namedStyleType: role.namedStyleType,
        lineSpacing: role.namedStyleType === "NORMAL_TEXT"
          ? formatting.bodyLineSpacing
          : role.namedStyleType === "TITLE"
            ? formatting.titleLineSpacing
            : formatting.headingLineSpacing,
      };
      let fields = "namedStyleType,lineSpacing";
      if (role.namedStyleType === "HEADING_1") {
        paragraphStyle.borderBottom = {
          color: { color: { rgbColor: formatting.heading1Border.color } },
          width: { magnitude: formatting.heading1Border.widthPt, unit: "PT" },
          padding: { magnitude: 0, unit: "PT" },
          dashStyle: "SOLID",
        };
        fields += ",borderBottom";
      }
      if (issueKinds.has("paragraph-role") || issueKinds.has("heading1-border")) {
        roleRequests.push({
          updateParagraphStyle: { range, paragraphStyle, fields },
        });
      }
      if (issueKinds.has("paragraph-role")) {
        roleRequests.push({
          updateTextStyle: {
            range,
            textStyle: {
              fontSize: { magnitude: formatting[role.fontSizeKey], unit: "PT" },
              weightedFontFamily: { fontFamily: formatting.fontFamily, weight: role.bold ? 700 : 400 },
              bold: role.bold,
              italic: role.italic,
            },
            fields: "fontSize,weightedFontFamily,bold,italic",
          },
        });
      }
      if (role.boldPrefixLength > 0 && issueKinds.has("paragraph-role")) {
        const firstRichLink = paragraphs[index].paragraph.elements?.find((element) => element.richLink);
        const prefixRange = firstRichLink && role.blockType === "link"
          ? {
              startIndex: firstRichLink.startIndex,
              endIndex: firstRichLink.endIndex,
              tabId: target.tabId,
            }
          : {
              startIndex: range.startIndex,
              endIndex: Math.min(range.endIndex, range.startIndex + role.boldPrefixLength),
              tabId: target.tabId,
            };
        roleRequests.push({
          updateTextStyle: {
            range: prefixRange,
            textStyle: {
              weightedFontFamily: { fontFamily: formatting.fontFamily, weight: 700 },
              bold: true,
              ...(role.blockType === "link" ? {
                underline: formatting.link.underline,
                foregroundColor: { color: { rgbColor: formatting.link.color } },
              } : {}),
            },
            fields: role.blockType === "link"
              ? "weightedFontFamily,bold,underline,foregroundColor"
              : "weightedFontFamily,bold",
          },
        });
      }
    }
  }

  const inlineRequests = [];
  const inlineRepairs = new Map();
  for (const issue of issues.filter((candidate) =>
    ["bold", "italic", "link-style"].includes(candidate.kind))) {
    const key = `${issue.startIndex}:${issue.endIndex}`;
    const repair = inlineRepairs.get(key) ?? {
      range: { startIndex: issue.startIndex, endIndex: issue.endIndex, tabId: target.tabId },
      textStyle: {},
      fields: new Set(),
    };
    if (issue.kind === "bold") {
      repair.textStyle.bold = issue.expected;
      repair.fields.add("bold");
    } else if (issue.kind === "italic") {
      repair.textStyle.italic = issue.expected;
      repair.fields.add("italic");
    } else {
      repair.textStyle.underline = formatting.link.underline;
      repair.textStyle.foregroundColor = { color: { rgbColor: formatting.link.color } };
      repair.fields.add("underline");
      repair.fields.add("foregroundColor");
    }
    inlineRepairs.set(key, repair);
  }
  for (const repair of inlineRepairs.values()) {
    inlineRequests.push({
      updateTextStyle: {
        range: repair.range,
        textStyle: repair.textStyle,
        fields: [...repair.fields].join(","),
      },
    });
  }

  return [
    ...[...fontGroups.values()].flatMap(({ fontSizePt, bold, italic, ranges }) =>
      mergeRanges(ranges).map((range) => ({
      updateTextStyle: {
        range: { ...range, tabId: target.tabId },
        textStyle: {
          fontSize: { magnitude: fontSizePt, unit: "PT" },
          weightedFontFamily: { fontFamily: formatting.fontFamily, weight: bold ? 700 : 400 },
          bold,
          italic,
        },
        fields: "fontSize,weightedFontFamily,bold,italic",
      },
    }))),
    ...[...spacingGroups.entries()].flatMap(([lineSpacing, ranges]) => mergeRanges(ranges).map((range) => ({
      updateParagraphStyle: {
        range: { ...range, tabId: target.tabId },
        paragraphStyle: { lineSpacing },
        fields: "lineSpacing",
      },
    }))),
    ...roleRequests,
    ...inlineRequests,
    ...listRequests,
  ];
}

export function assertFormatting(tab, target, formatting) {
  const issues = formattingIssues(tab, target, formatting);
  if (!issues.length) return;
  const first = issues[0];
  throw new Error(
    `${target.expectedTitle} formatting mismatch at ${first.startIndex}:${first.endIndex}: ` +
    `${first.kind} expected ${first.expected}, found ${first.actual}`,
  );
}
