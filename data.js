// SIE Exam Prep — Question Bank
// Organized by chapter, mirroring the FINRA SIE exam outline.
const CHAPTERS = [
  {
    id: "ch1",
    title: "Regulatory Framework",
    blurb: "SEC, FINRA, SROs, and the rules that govern the industry.",
    questions: [
      q("Which organization has primary authority for enforcing federal securities laws?", ["FINRA","The Securities and Exchange Commission (SEC)","The Federal Reserve","The MSRB"], 1, "The SEC is the federal regulator created by the Securities Exchange Act of 1934; FINRA is an SRO that operates under SEC oversight."),
      q("FINRA is best described as a:", ["Federal government agency","Self-regulatory organization (SRO)","Stock exchange","Clearing corporation"], 1, "FINRA is a non-governmental SRO that writes and enforces rules for broker-dealers, under SEC oversight."),
      q("The Securities Act of 1933 primarily regulates:", ["Trading on the secondary market","The issuance of new securities (primary market)","Insider trading","Investment company registration"], 1, "The '33 Act is the 'paper act,' requiring registration and disclosure (prospectus) for new issues."),
      q("Which act created the SEC and regulates the secondary market?", ["Securities Act of 1933","Securities Exchange Act of 1934","Investment Company Act of 1940","Trust Indenture Act of 1939"], 1, "The 1934 Act created the SEC and governs exchanges, broker-dealers, and secondary trading."),
      q("Under the Securities Exchange Act of 1934, which practice is explicitly prohibited?", ["Short selling","Manipulating the market price of a security","Margin trading","Day trading"], 1, "Market manipulation (e.g., wash trades, matched orders) is prohibited under the '34 Act."),
      q("A municipal securities dealer's activities are primarily regulated by:", ["The MSRB","The CFTC","The FDIC","The OCC"], 0, "The Municipal Securities Rulemaking Board (MSRB) writes rules for municipal bond dealers; FINRA enforces them for broker-dealers."),
      q("The Securities Investor Protection Corporation (SIPC) protects customers primarily against:", ["Investment losses due to market decline","Brokerage firm insolvency","Fraudulent investment advice","Interest rate risk"], 1, "SIPC covers losses from broker-dealer failure (missing assets), not market losses."),
      q("Which of the following is NOT a self-regulatory organization?", ["FINRA","MSRB","SEC","Nasdaq"], 2, "The SEC is a federal government agency, not an SRO."),
      q("An associated person who wishes to leave the securities industry must be reported via which form?", ["Form U4","Form U5","Form BD","Form ADV"], 1, "Form U5 is the Uniform Termination Notice for Securities Industry Registration."),
      q("Which form is used to register an individual with FINRA?", ["Form U4","Form U5","Form BD","Form 144"], 0, "Form U4 is used to register representatives and disclose background information."),
    ],
  },
  {
    id: "ch2",
    title: "Equity Securities",
    blurb: "Common stock, preferred stock, rights, and warrants.",
    questions: [
      q("Which type of stock typically carries voting rights?", ["Preferred stock","Common stock","Treasury stock","Convertible bonds"], 1, "Common shareholders generally have voting rights; preferred shareholders typically do not."),
      q("A company in bankruptcy liquidates assets. Which group is paid LAST?", ["Bondholders","Preferred shareholders","Common shareholders","General creditors"], 2, "Common shareholders are residual claimants and are paid last, after creditors, bondholders, and preferred shareholders."),
      q("Cumulative preferred stock means that:", ["Dividends compound with interest","Missed dividends accumulate and must be paid before common dividends","The stock can be converted into common shares","Dividends increase automatically each year"], 1, "With cumulative preferred, any omitted dividends accrue and must be paid before common shareholders receive dividends."),
      q("A stock that allows holders to exchange preferred shares for common shares is called:", ["Callable preferred","Cumulative preferred","Convertible preferred","Participating preferred"], 2, "Convertible preferred stock can be exchanged for a fixed number of common shares."),
      q("A stock right typically allows an existing shareholder to:", ["Receive a fixed dividend forever","Buy additional shares below market price to maintain proportional ownership","Vote twice per share","Convert to a bond"], 1, "Rights are short-term instruments protecting against dilution, allowing purchase of new shares at a discount."),
      q("A warrant differs from a right primarily because a warrant:", ["Is issued for free to current shareholders only","Has a much longer expiration, often years","Cannot be traded","Pays a fixed dividend"], 1, "Warrants are typically long-term (often 2-10 years) and are usually attached to a bond or preferred stock offering as a sweetener."),
      q("The ex-dividend date is set by:", ["The issuer","The customer","FINRA based on settlement cycle","The SEC"], 2, "The ex-dividend date is set based on the regular-way settlement cycle relative to the record date, per industry rules."),
      q("An investor who buys stock on the ex-dividend date will:", ["Receive the upcoming dividend","Not receive the upcoming dividend","Receive double the dividend","Receive a stock split instead"], 1, "Buying on or after the ex-date means the seller, not the buyer, retains the right to the dividend."),
    ],
  },
  {
    id: "ch3",
    title: "Debt Securities",
    blurb: "Corporate, municipal, and government bonds; yields and risk.",
    questions: [
      q("As a bond's market price increases, its current yield will:", ["Increase","Decrease","Stay the same","Become negative"], 1, "Bond prices and yields move inversely; a higher price means a lower yield."),
      q("A bond is trading at a premium. This means it is trading:", ["Below par value","Above par value","At par value","Below face value only at maturity"], 1, "A premium bond trades above its par (face) value, usually because its coupon exceeds current market rates."),
      q("Which yield measure accounts for both coupon income and price appreciation/depreciation to maturity?", ["Nominal yield","Current yield","Yield to maturity (YTM)","Dividend yield"], 2, "YTM reflects total return including price difference from par, amortized over the life of the bond."),
      q("General obligation (GO) municipal bonds are backed by:", ["Revenue from a specific project","The full taxing power of the issuer","Federal government guarantee","Corporate earnings"], 1, "GO bonds are backed by the issuer's taxing authority, not a specific revenue stream."),
      q("Revenue bonds are typically repaid from:", ["General tax revenue","Income generated by the specific project financed","The federal treasury","Property taxes only"], 1, "Revenue bonds rely on income from the facility or project they fund (e.g., toll roads, utilities)."),
      q("Treasury bills (T-bills) are issued with maturities of:", ["1 to 10 years","More than 10 years","One year or less","20 to 30 years"], 2, "T-bills are short-term instruments with maturities of one year or less, issued at a discount."),
      q("Which of these is considered to have the least credit risk?", ["Corporate junk bonds","Municipal revenue bonds","U.S. Treasury securities","Convertible corporate bonds"], 2, "Treasuries are backed by the full faith and credit of the U.S. government, considered virtually free of default risk."),
      q("A bond's credit rating primarily reflects:", ["Interest rate risk","The issuer's ability to make timely interest and principal payments","Liquidity in the secondary market","Tax treatment of the bond"], 1, "Rating agencies like Moody's and S&P assess default/credit risk, not interest rate or liquidity risk directly."),
      q("Zero-coupon bonds:", ["Pay interest semiannually","Are issued at a discount and pay no periodic interest","Cannot be issued by corporations","Always have variable rates"], 1, "Zero-coupon bonds are sold at a deep discount to par and pay full face value at maturity, with no periodic coupon."),
    ],
  },
  {
    id: "ch4",
    title: "Packaged Products",
    blurb: "Mutual funds, ETFs, UITs, and annuities.",
    questions: [
      q("An open-end investment company (mutual fund) continuously:", ["Trades on an exchange at market price","Issues and redeems shares at NAV","Has a fixed number of shares","Pays a guaranteed return"], 1, "Open-end funds issue new shares and redeem existing ones based on net asset value (NAV), with no fixed share count."),
      q("A fund's NAV per share is calculated by:", ["Dividing total assets by total liabilities","Subtracting liabilities from assets, divided by shares outstanding","Multiplying share price by total shares","Adding the sales charge to the offering price"], 1, "NAV = (Total Assets − Total Liabilities) ÷ Shares Outstanding."),
      q("A front-end sales load on a mutual fund is charged:", ["When shares are redeemed","Annually regardless of purchases","At the time of purchase, reducing the amount invested","Only on reinvested dividends"], 2, "Class A shares typically charge a front-end load deducted at purchase, reducing the invested amount."),
      q("Which feature distinguishes an ETF from a traditional open-end mutual fund?", ["ETFs cannot be sold short","ETFs trade throughout the day on an exchange like a stock","ETFs do not have an expense ratio","ETFs are only available to institutions"], 1, "Unlike mutual funds priced once daily, ETFs trade intraday at fluctuating market prices."),
      q("A Unit Investment Trust (UIT) typically has:", ["An actively managed, changing portfolio","A fixed, unmanaged portfolio held to a set termination date","No expense ratio whatsoever","Daily new issuances of units"], 1, "UITs hold a fixed portfolio and are not actively managed; they terminate on a predetermined date."),
      q("In a variable annuity, the investment risk during the accumulation phase is borne by:", ["The insurance company","The annuitant (contract owner)","FINRA","The state guaranty fund"], 1, "Unlike fixed annuities, variable annuity owners bear the investment risk since returns depend on the separate account's performance."),
      q("Surrender charges on an annuity are designed to:", ["Reward early withdrawals","Penalize withdrawals made shortly after purchase","Increase the death benefit","Reduce taxes owed"], 1, "Surrender charges discourage early withdrawal and typically decline over a set number of years."),
      q("Breakpoints on mutual fund purchases offer investors:", ["A higher sales charge for larger purchases","A reduced sales charge for larger purchase amounts","Guaranteed returns","Tax-free distributions"], 1, "Breakpoints lower the percentage sales charge as the investment amount crosses certain thresholds."),
    ],
  },
  {
    id: "ch5",
    title: "Options",
    blurb: "Calls, puts, premiums, and basic strategies.",
    questions: [
      q("Buying a call option gives the holder the right to:", ["Sell stock at the strike price","Buy stock at the strike price","Receive dividends automatically","Vote at shareholder meetings"], 1, "A call buyer has the right (not obligation) to buy the underlying at the strike price before expiration."),
      q("A put option increases in value when the underlying stock:", ["Rises in price","Falls in price","Pays a dividend","Splits 2-for-1"], 1, "Puts give the right to sell at the strike price, so they gain value as the underlying price falls."),
      q("The seller (writer) of an uncovered (naked) call has:", ["Limited risk and limited profit potential","Unlimited risk and limited profit potential (the premium)","Unlimited profit and no risk","No obligation if exercised"], 1, "A naked call writer's loss is theoretically unlimited if the stock rises, while maximum gain is the premium received."),
      q("Maximum loss for a buyer of a call option is limited to:", ["The strike price","The premium paid","Unlimited","The market price of the stock"], 1, "Option buyers can never lose more than the premium they paid."),
      q("An option is 'in the money' for a call holder when:", ["The market price is below the strike price","The market price equals the strike price","The market price is above the strike price","The option has expired"], 2, "A call is in the money when the stock's market price exceeds the strike price."),
      q("The Options Clearing Corporation (OCC) functions as the:", ["Exchange where options trade","Issuer and guarantor of all listed options contracts","Regulator of broker-dealers","Custodian of customer funds"], 1, "The OCC issues, guarantees, and clears all listed option contracts in the U.S."),
    ],
  },
  {
    id: "ch6",
    title: "Retirement Plans & Taxation",
    blurb: "IRAs, employer plans, and tax treatment of investments.",
    questions: [
      q("Contributions to a Traditional IRA are generally made with:", ["After-tax dollars, and qualified withdrawals are tax-free","Pre-tax (or deductible) dollars, with withdrawals taxed as ordinary income","Employer matching only","Tax credits instead of deductions"], 1, "Traditional IRA contributions may be tax-deductible, and withdrawals in retirement are taxed as ordinary income."),
      q("Roth IRA qualified withdrawals are:", ["Taxed as ordinary income","Taxed as capital gains","Tax-free","Subject to a 10% penalty regardless of age"], 2, "Roth contributions are after-tax, so qualified distributions in retirement are entirely tax-free."),
      q("A 401(k) plan is an example of a:", ["Defined benefit plan","Defined contribution plan","Non-qualified deferred compensation plan only","Government pension"], 1, "401(k)s are defined contribution plans where the benefit depends on contributions and investment performance."),
      q("Long-term capital gains tax rates apply to assets held for:", ["Less than 30 days","Less than 6 months","More than one year","Exactly 90 days"], 2, "Assets held longer than one year qualify for typically lower long-term capital gains rates."),
      q("Dividends that qualify for preferential tax treatment are generally taxed at:", ["Ordinary income tax rates","Long-term capital gains rates","A flat 50% rate","They are always tax-exempt"], 1, "Qualified dividends are taxed at the same favorable rates as long-term capital gains."),
      q("An early withdrawal from a Traditional IRA before age 59½ typically incurs:", ["No penalty if under $10,000","A 10% penalty plus ordinary income tax (with some exceptions)","Only a 10% penalty, no tax","A mandatory loan repayment plan"], 1, "Early IRA withdrawals are generally subject to ordinary income tax plus a 10% penalty, absent an exception."),
    ],
  },
  {
    id: "ch7",
    title: "Customer Accounts & Trading",
    blurb: "Account types, orders, margin, and settlement.",
    questions: [
      q("A market order will:", ["Execute immediately at the best available price","Only execute at a specified price or better","Never execute","Execute only at the close of trading"], 0, "Market orders prioritize speed of execution over price, filling at the best available current price."),
      q("A buy limit order is placed:", ["Above the current market price","At or below the current market price","Only for short sales","Only at the market open"], 1, "A buy limit order sets the maximum price a buyer is willing to pay, placed at or below the current market."),
      q("Regular-way settlement for most equity and corporate bond trades in the U.S. is:", ["Trade date plus 1 business day (T+1)","Trade date plus 5 business days","Cash on trade date only","Trade date plus 10 business days"], 0, "As of 2024, the standard settlement cycle for most securities is T+1."),
      q("In a margin account, Regulation T sets the initial margin requirement for equity purchases at:", ["10%","25%","50%","100%"], 2, "Regulation T currently requires an initial margin deposit of 50% of the purchase price for most equity securities."),
      q("A joint account 'with rights of survivorship' means that upon the death of one owner:", ["The account is frozen permanently","Assets automatically pass to the surviving owner(s)","Assets go to the deceased's estate","The brokerage firm takes ownership"], 1, "JTWROS accounts pass the deceased owner's share directly to surviving joint owner(s), bypassing probate."),
      q("A discretionary account requires which of the following before discretion is exercised?", ["Verbal approval only","Written authorization from the customer","No documentation if the rep is a principal","Approval from the SEC"], 1, "FINRA rules require written authorization from the customer before a representative can exercise discretion."),
    ],
  },
  {
    id: "ch8",
    title: "Prohibited Activities & Ethics",
    blurb: "Insider trading, suitability, and industry conduct rules.",
    questions: [
      q("Trading on material, nonpublic information is known as:", ["Front running","Insider trading","Churning","Arbitrage"], 1, "Insider trading involves trading based on material nonpublic information in breach of a duty."),
      q("Excessive trading in a customer account primarily to generate commissions is called:", ["Churning","Front running","Spinning","Painting the tape"], 0, "Churning is excessive, unsuitable trading driven by the rep's interest in generating commissions, not the client's."),
      q("Before recommending a transaction, a registered representative must consider the customer's:", ["Social media activity","Investment profile, including risk tolerance and objectives","Favorite stock sector only","Political affiliation"], 1, "FINRA's suitability rule requires a reasonable basis grounded in the customer's investment profile."),
      q("Sharing in the profits and losses of a customer's account without proper approval and a joint ownership interest is:", ["Permitted for all registered reps","A prohibited practice unless specific conditions are met","Required for discretionary accounts","Only allowed for institutional clients"], 1, "Sharing in customer accounts is generally prohibited unless the rep has a proportional ownership interest and firm approval."),
      q("'Front running' refers to:", ["Trading ahead of a large block order using advance knowledge of it","Trading after market close","Filing trade reports late","Recommending only blue-chip stocks"], 0, "Front running is placing a personal or firm trade ahead of a known, pending large customer order to profit from the anticipated price move."),
      q("Using social media to make exaggerated or unwarranted claims about an investment is:", ["Permitted if disclosed as an opinion","A violation of communication standards/anti-fraud rules","Allowed only for institutional audiences","Only restricted on Twitter"], 1, "All communications, including social media, must be fair, balanced, and not misleading."),
    ],
  },
];

function q(question, choices, correct, explain) {
  return { question, choices, correct, explain };
}

// assign stable ids
CHAPTERS.forEach((ch, ci) => {
  ch.questions.forEach((qq, qi) => {
    qq.id = ch.id + "-q" + qi;
  });
});
