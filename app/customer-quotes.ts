export type CustomerQuoteRecord = {
  quote: string;
  theme: string;
  source: string;
  period: string;
};

export const customerQuotesSource = {
  documentId: "1eMVc8liDi-s3PGIdXN9lVaM9uOZOJGLGmbuBbt4DCco",
  tabId: "t.vwocc5k1v4db",
  revisionId:
    "AIroW37YxXWZnoQEWjVpu0yZN4lzDriNuqm4d09juKuMu_KqE3pA0S8AX3g5w5XrQlcX9hvsIHJRvqNkdz4Up4ZXmJb0j8ONMy4F_XA97qw",
  url: "https://docs.google.com/document/d/1eMVc8liDi-s3PGIdXN9lVaM9uOZOJGLGmbuBbt4DCco/edit?tab=t.vwocc5k1v4db",
  syncedOn: "2026-07-30",
} as const;

type QuoteGroup = {
  source: string;
  period: string;
  items: Array<{
    theme: string;
    quote: string;
  }>;
};

const quoteGroups: QuoteGroup[] = [
  {
    source: "VOC Customer Interview · Participant 1",
    period: "Q1 2026",
    items: [
      {
        theme: "Test-drive eligibility",
        quote:
          "I was a little skeptical at first because when I first tried Root, they wanted me to drive first to see my driving habits. So the first time I drove, Root would not accept me",
      },
    ],
  },
  {
    source: "VOC Customer Interview · Participant 2",
    period: "Q1 2026",
    items: [
      {
        theme: "Everyday driving costs",
        quote:
          "It's disappointing because as high as gas is, I try to, I map out my days like anything I have to do. And then I have an app called Road Warrior. So anywhere I need to go in a particular day, I will put it in the app, and it'll give me a map on which way I should go to save on gas",
      },
      {
        theme: "Human support",
        quote:
          "If you notice, it's only on a chatbot. There's no phone; there's no actual phone number for me to talk to someone, and I had to look the phone number up. Moderator: Is talking to someone on the phone, is that your preferred method of communication? Yes. Because I may have questions that the chatbot is not familiar with. You know, and I'm just old school.",
      },
    ],
  },
  {
    source: "VOC Customer Interview · Participant 3",
    period: "Q1 2026",
    items: [
      {
        theme: "Telematics trust",
        quote:
          "Moderator: ‘Do you have the Root app downloaded on your phone?’ No. Moderator: ‘Well, first of all, can you let me know why?’ What I heard is that some apps monitor your driving. And they just find ways to make your rate go up. So... that’s why I didn’t touch the app. Moderator: ‘Would you feel comfortable downloading it for this session and deleting afterwards?’ No",
      },
      {
        theme: "Proactive support",
        quote:
          "Moderator: ‘What, if anything, would make you feel that your car insurer cares about you?’ When they initiate things, kind of hold your hand, and walk you through. You know, it feels like they care about you. I don’t like when they expect you to do the footwork. I feel appreciated when I call contact a human being quickly",
      },
    ],
  },
  {
    source: "Q1 VOC Report · App reviews",
    period: "Q1 2026",
    items: [
      {
        theme: "Policy changes",
        quote:
          "I bought a policy yesterday, and today I wanted to change vehicles, but I couldn't. I called the office twice, spent an hour on hold, and even then, they couldn't help me. I canceled my policy and asked for a refund",
      },
      {
        theme: "Proof of insurance",
        quote:
          "If you get pulled over and need proof of insurance, you won’t be able to pull it up",
      },
    ],
  },
  {
    source: "Q1 VOC Report · Independent agents",
    period: "Q1 2026",
    items: [
      {
        theme: "Quote consistency",
        quote:
          "Every time I bridge over to Root, the price increased significantly compared to the quoted price on Turborater, and I have to go back to the rater and quote the customer another insurer. So, most of the time, if I see Root as the cheapest, I will choose another carrier.",
      },
    ],
  },
  {
    source: "10/10 Independent Agents Survey · Detractors",
    period: "Q2 2026",
    items: [
      {
        theme: "Agent servicing control",
        quote:
          "As the agent, all you can do is view the policy. We cannot make changes, take payments...",
      },
      {
        theme: "Policy & endorsement flexibility",
        quote:
          "Your system is restrictive. I can’t put a liability vehicle and a full coverage vehicle on the same policy. Agents are also unable to process their own endorsements",
      },
    ],
  },
  {
    source: "10/10 Independent Agents Survey",
    period: "Q2 2026",
    items: [
      {
        theme: "Portal data & usability",
        quote:
          "I’d like to see if tickets showed up on MVR. Also, I'm unable to copy their email from the main screen because it's a link, and no email shows when I'm in a policy",
      },
      {
        theme: "Agent servicing control",
        quote:
          "Agents don't have servicing independence, which is extremely upsetting",
      },
      {
        theme: "Quote workflow & coverage options",
        quote:
          "You have to go to a different site to add a leinholder. That’s a hassle when literally everyone else has it during the quote. Also you can't add SR22. I know you guys have it, but clients can’t wait for the paperwork",
      },
    ],
  },
  {
    source: "Rebrand Consumer Interview · Participant 1",
    period: "Q2 2026",
    items: [
      {
        theme: "Rate increases & life circumstances",
        quote:
          "I think it's across the board. I recently lost my husband, and all these companies raised my rates. I'm going through enough. Feels like being punished. Thinking downsizing would save money, but it did the opposite. Logically, it makes no sense.",
      },
      {
        theme: "Human support & AI",
        quote:
          "A part of me feels like I don't know how to connect with Lemonade. Picking up the phone and talking to somebody, I don't know how to do that, but maybe that's what I'm paying for.",
      },
      {
        theme: "Shopping experience",
        quote:
          "It sucks. Painful, frustrating, expensive.",
      },
      {
        theme: "Lead-generation pressure",
        quote:
          "The frustrating part of looking online is I want to give the info, but I don't want the inundation of phone calls and emails. Why do I have to give that info? Just get me the quote",
      },
      {
        theme: "Insurance trust",
        quote:
          "I don't trust insurers to have the best interests of their consumers. There's no transparency of what we pay for",
      },
      {
        theme: "Brand proposition clarity",
        quote:
          "When I read ‘insurance built to keep you moving,’ I'm thinking, ‘well, how would it slow you down?’",
      },
      {
        theme: "Brand-name clarity",
        quote:
          "Trying to understand the name of it. ‘Ruut’ what is ‘ruut’. It's like Lemonade, why would you name your insurance company Lemonade?",
      },
      {
        theme: "Brand positioning",
        quote:
          "The average consumer wants the best deal for their family and personal situation. If they can say they are high quality, simple, and affordable, then that's the message they need to send.",
      },
    ],
  },
  {
    source: "Rebrand Consumer Interview · Participant 3",
    period: "Q2 2026",
    items: [
      {
        theme: "Value of coverage",
        quote:
          "I know I need insurance that isn't going to leave me dry and high when a drunk yahoo hits me... I hate that it is so expensive to be protected for something I almost never use at all...",
      },
      {
        theme: "Peer reviews & trust",
        quote:
          "Reddit is, for me, the ultimate arbiter of honesty... What do reviews look like on Reddit?",
      },
    ],
  },
  {
    source: "Rebrand Consumer Interview · Participant 4",
    period: "Q2 2026",
    items: [
      {
        theme: "Insurance affordability",
        quote:
          "I live next to an income-based apartment complex. Many of them don't have car insurance because they can barely afford housing. They need to get to doctor appointments and such, but public trans is poor, and so you have to drive... There isn't a program for the elderly or the poor who need that... They can't afford $70/mo for basic transportation needs.",
      },
    ],
  },
  {
    source: "Rebrand Consumer Interview · Participant 5",
    period: "Q2 2026",
    items: [
      {
        theme: "Telematics fairness",
        quote:
          "I've always been affected by things I can't help. For example, I lose points every time I drive at night... I can't tell my boss I can't come in at night because my insurance is going to go up. That's stupid!",
      },
      {
        theme: "Brand tone",
        quote:
          "I don't want to think about hustling when I'm getting insurance. There's a lot going on.",
      },
    ],
  },
  {
    source: "Rebrand Consumer Interview · Participant 7",
    period: "Q2 2026",
    items: [
      {
        theme: "Insurance trust",
        quote:
          "I don't really trust any company, really. They’re not robbing, but at the end of the day, they're looking out for themselves and want to make a profit",
      },
      {
        theme: "Personalized feedback",
        quote:
          "I liked the score tracking... It feels like it's for an individual person. Every time you make someone feel special, it goes a long way",
      },
    ],
  },
  {
    source: "Rebrand Consumer Interview · Participant 8",
    period: "Q2 2026",
    items: [
      {
        theme: "AI & human support",
        quote:
          "I'm a hater of AI. Not everything needs to be AI. I hate when you need to talk to a real person, and it's an AI pretending to be a real person.",
      },
      {
        theme: "Rewards proposition",
        quote:
          "The idea of not paying is more appealing than Lemonade's giving back what you do pay.",
      },
    ],
  },
  {
    source: "10/10 DTC Benchmark Survey · NPS detractors",
    period: "Q2 2026",
    items: [
      {
        theme: "Rate increases",
        quote:
          "I have no accidents or tickets with the last 5 years and my rates continue to go up. I actually plan on leaving within the next 30 days",
      },
      {
        theme: "Loyalty & rewards",
        quote:
          "There is no loyal customer discount. There are no rewards and/or discounts for anything",
      },
    ],
  },
  {
    source: "App reviews · Platform not specified",
    period: "Q2 2026",
    items: [
      {
        theme: "Telematics fairness",
        quote:
          "I don't believe their driving data accurately reflects my actual driving, yet they continue using it to justify significant premium increases",
      },
      {
        theme: "Human support",
        quote:
          "The rates are competitive; however, all communication is handled through the app, and meaningful interaction becomes nonexistent after enrollment",
      },
      {
        theme: "Telematics trip classification",
        quote:
          "My autistic son has my phone playing a game to keep him calm in the car when I'm driving and I notice my score going down as if I'm using my phone. How can we correct this?",
      },
      {
        theme: "Telematics feature education",
        quote:
          "I was really excited to switch to this insurance and was fully prepared to do well on their driving test. However, because I drive for Uber, my distraction score ended up ruining my average. They then decided to inform me that there is a \"passenger button.\" Nobody explained that feature to me beforehand, and by then, it was already too late",
      },
    ],
  },
  {
    source: "Google Play Store · 1-star reviews",
    period: "Q2 2026",
    items: [
      {
        theme: "Rate increases",
        quote:
          "They will increase your rate every time you renew regardless of accidents, driving habits, etc. They doubled my rates even though I'd had no infractions, accidents, or late payments and said it was because of my credit utilization had gone up and because of where I live... (I've lived here for 4 years) scummy and predatory business that baits you with low rates and then raises them. I switched to a bigger company and it's $37 cheaper than Root before they raised my rate.",
      },
      {
        theme: "Claims communication",
        quote:
          "I had an accident back in November of 25 and as of April 26 my car is still not fixed. I finally got the car in the shop but lack of communication has it sitting in the shop right now waiting on supplemental work. I have tried to get their management to talk to me so I can see what happened with communication but even they are not reaching out. I would not recommend this insurance anymore. After 10 years of being with them, mostly good, this has been the worst experience with an accident.",
      },
    ],
  },
  {
    source: "Google Play Store · 3-star review",
    period: "Q2 2026",
    items: [
      {
        theme: "Account access",
        quote:
          "Getting the insurance was super easy, but the problem is that when I wanted to go on the app to see when is my due date, I was not able to login it wants me to do everything all over like if I never had the insurance in the first place. now how can I be driving around with my kids thinking im covered when in reality im not \"apparently\"",
      },
    ],
  },
  {
    source: "Apple App Store · 1-star review · NPS 6 detractor",
    period: "Q2 2026",
    items: [
      {
        theme: "Account access & customer service",
        quote:
          "If I could give Root zero stars, I would! They were actually a decent company several years ago. I’m not sure what happened but now, you’re lucky to receive a response from them within a days (forget about a same day response). They will raise your rates significantly every 6 months, whether you’re a safe driver or not. Their app is absolute garbage. Any time I would try to log in on the app or desktop, it will treat you as a new customer and just keep loading to try and get you a new quote. Absolutely NO way to access your account, payment history, or insurance docs. When I notified Root of this, they made it seem like it was MY fault (um hello, check out the hundreds of other reviews stating the exact same problem). Hire some new web developers! I am so thankful I wasn’t in an accident because I literally would not have been able to access my insurance card. To top it all off, I initiated cancelling my policy and they took so long to get back to me that it renewed. Luckily I had already notified my bank so they didn’t take more of my money. I’m still going back and forth with them about cancelling because according to them I’m not the primary policy holder (absolute lie). Overall, stay very, very far away",
      },
    ],
  },
  {
    source: "In-App Survey Pilot at Sprig",
    period: "Q2 2026",
    items: [
      {
        theme: "Cancellation issues",
        quote:
          "Please, I want to cancel my policy with Root. I got a better offer… Thanks",
      },
      {
        theme: "Cancellation issues",
        quote:
          "I have been trying to cancel my policy for a week now, and you just keep giving me the run around. This is bullshit... Your waisting my money by having double insurance. You have no phone number to call or speak to anyone. This is the worst insurance I have ever seen.",
      },
      {
        theme: "Cancellation issues",
        quote:
          "The cancel policy button is all the way at the bottom of the screen, so I can not click on it. You also will not let me cancel online. I feel like you are a scam",
      },
      {
        theme: "Payment problems",
        quote:
          "You can’t make any payment arrangements on the app or browser. A lot of us go through hardship and need more time to pay. Also, it has to stop that you’re going to cancel our insurance a day before paying. It doesn’t make any sense. Please make some changes to help a lot of us stay with Root. If this can’t be fixed, I will have to move on.",
      },
      {
        theme: "Rate increases",
        quote:
          "It’s annoying to have to constantly pay more every time I renew my policy. Every 6 months does nothing but increase, due to ‘risks in the area’, but no reward for me not having any issues with my own driving.",
      },
      {
        theme: "Rate increases",
        quote:
          "I started off with a cheap $200 insurance, and then I’m paying double that price in renewal fees and other miscellaneous fees that you guys have added on",
      },
      {
        theme: "Rate increases",
        quote:
          "My score is 8/10, and I’m rewarded with a higher rate? Lolol. Guess this will be the last month with you. Geezus",
      },
      {
        theme: "Rate increases",
        quote:
          "They are raising rates exponentially. I have zero insurance claims in over five years and my rates are still going up",
      },
      {
        theme: "Payment authorization",
        quote:
          "I did not give you permission to take a payment today. You just put my account in the negative and caused a $30.00 overdraft fee",
      },
      {
        theme: "Rate increases",
        quote:
          "I called yesterday to make a payment and noticed my insurance policy was increasing for its renewal. I told them I was going to cancel it and go with somebody else since they were not able to get it back down to where it was before and now this morning, I noticed a payment came out of my account automatically.!!!! I want my policy canceled immediately and my money refunded immediately!!!!",
      },
      {
        theme: "Cancellation issues",
        quote: "Why did you guys take 62$ from me when I canceled my insurance?",
      },
      {
        theme: "Logout function",
        quote:
          "There needs to definitely be a logout button or sign out button. This is insane. It takes me 30 minutes to an hour to figure out how to sign up this app",
      },
      {
        theme: "Customer service",
        quote:
          "Terrible experience with Root and claims advisor. A piece of wood (not properly tied down) flew off a work truck, hitting my car and busting the windshield. The claims advisor says they cannot pursue the other driver for damages because there was a sign that read: ‘Stay back 100 ft.’ This happened when my car was passing the work truck, HOW do you stay back 100 ft FOREVER? This makes no sense, and I would have expected my insurance company to go to bat for me. Very disappointed and will never recommend Root. They just lie down and don’t care about the customer",
      },
      {
        theme: "Communication issues",
        quote:
          "I've been pulled over three times now because it's not showing up in their computers as me having insurance, not cool at all, very disappointing",
      },
      {
        theme: "Uncategorized / other",
        quote:
          "Hi! I just canceled my policy today because I sold my car and am planning to move out of the country. However, I wanted to say thank you! Root has been fantastic for me over the years. I do not have any complaints. And I know this is a weird message to leave, but I hope somebody reads it! If I move back to the States in the future, I will definitely be coming back to Root!",
      },
    ],
  },
  {
    source: "Customer Survey",
    period: "Q2 2026",
    items: [
      {
        theme: "Affordability & value",
        quote:
          "I really value Root. It has saved me so much money, and I’m able to still be insured while paying much less, so I can focus on taking care of my mother and helping with her medical bills.",
      },
      {
        theme: "Mobile app & onboarding",
        quote:
          "This is the first insurance company where my payment amount actually decreased the longer I was with the company.",
      },
      {
        theme: "Cancellation policy flexibility",
        quote:
          "Please don't send cancellations for policies that are paid within a 48-hour period after their due date. We are a veteran family and are paid once a month on the first. We cannot help that the funds are not available until the bank releases the funds. It would be nice if the company could change that policy, as it causes undue distress when you receive a mailer stating that your insurance is going to be canceled for non-payment, even though the policy is indeed paid. Otherwise, thank you for being a reasonably priced insurer in times when costs are astronomical.",
      },
    ],
  },
  {
    source: "Customer Choice Survey",
    period: "Source date not specified",
    items: [
      {
        theme: "Telematics score clarity",
        quote:
          "I feel like I just need more confidence in, like, how does the score actually get developed. 60/100 isn't great even in school. I don't have confidence in how my score is going to be decided.",
      },
      {
        theme: "Payment options",
        quote: "Ok! We got Apple Pay! We don't see that every day",
      },
      {
        theme: "Quote transparency",
        quote:
          "If you're proud of your quote, then SHOW me that quote! And if there's savings, then show me that after.",
      },
      {
        theme: "Data privacy & value exchange",
        quote:
          "All apps collect your data, so might as well get a discount if they're already doing that",
      },
    ],
  },
  {
    source: "Billing and Payments Vision Research",
    period: "Q3 2025",
    items: [
      {
        theme: "Payment flexibility",
        quote:
          "If I had been able to manage the payment by maybe paying it twice a month, I think I probably still would be with Root right now.",
      },
      {
        theme: "Rate communication",
        quote:
          "I was upset about a rate hike, but when the customer service agent explained it clearly—saying, “it’s not on you, but us”—and clarified that the change was in totality rather than tied to my actions, I felt reassured.",
      },
      {
        theme: "Budgeting",
        quote:
          "Savings? None. We are really bad at budgeting. Impulse control is probably our #1 pain point.",
      },
    ],
  },
];

export const customerQuotes: CustomerQuoteRecord[] = quoteGroups.flatMap(
  ({ source, period, items }) =>
    items.map(({ theme, quote }) => ({
      quote,
      theme,
      source,
      period,
    })),
);
