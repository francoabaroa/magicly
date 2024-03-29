import React from 'react';
import Layout from '../components/Layout';
import MagiclyPageTitle from '../components/shared/MagiclyPageTitle';
import { withApollo } from '../apollo/apollo';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      paddingTop: '10px',
      margin: 'auto',
      textAlign: 'center',
    },
    centerText: {
      margin: 'auto',
      textAlign: 'center',
    },
    paper: {
      textAlign: 'center',
      color: '#840032',
      backgroundColor: "#E5DADA",
      border: '5px #840032 solid',
      borderColor: '#840032',
    },
    privacyAmt: {
      color: '#0A7EF2'
    },
    privacyPage: {
      marginRight: '30px',
      marginLeft: '30px',
    },
    boldFont: {
      fontWeight: 'bold',
    }
  }),
);

// TODO: once Magicly LLC is filed, need to replace Sincero references below (as well as privacy@sincero.tech)
const PrivacyPage = () => {
  const classes = useStyles();
  return (
    <Layout>
      <div className={classes.privacyPage}>
      <Grid container justify="center" alignContent="center" alignItems="center">
        <Grid item xs={12}>
            <MagiclyPageTitle
              title={'Privacy Policy'}
            />
        </Grid>
      </Grid>
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12}>
            <p><em>Last updated: October 4, 2020</em></p>

            <p>
              The privacy of your data — and it is your data, not ours! — is a big deal to us. In this policy, we lay out: what data we collect and why; how your data is handled; and your rights to your data. We promise we never sell your data: never have, never will.
              This policy applies to all products built and maintained by Sincero, LLC including Magicly (all versions).
            </p>
            <h2>
              What we collect and why
            </h2>
            <p>
              Our guiding principle is to collect only what we need. Here’s what that means in practice:
            </p>
            <h3>
              Identity & access
            </h3>
            <p>
              When you sign up for a Magicly product, we typically ask for identifying information such as your name, email address, and maybe a company name. That’s just so you can personalize your new account, and we can send you invoices, updates, or other essential information. We sometimes also give you the option to add a profile picture that displays in our products, but we do not normally look at or access that picture. We’ll never sell your personal info to third parties, and we won’t use your name or company in marketing statements without your permission either.
            </p>
            <h3>
              Billing information
            </h3>
            <p>
              When you pay for a Magicly product, we ask for your credit card and billing address. That’s so we can charge you for service, calculate taxes due, and send you invoices. Your credit card is passed directly to our payment processor and doesn't ever go through our servers. We store a record of the payment transaction, including the last 4 digits of the credit card number and as-of billing address, for account history, invoicing, and billing support. We store your billing address to calculate any sales tax due in the United States or VAT in the EU, to detect fraudulent credit card transactions, and to print on your invoices.
            </p>
            <h3>
              Geolocation data
            </h3>
            <p>
              We log all access to all accounts by full IP address so that we can always verify no unauthorized access has happened. We keep this login data for as long as your product account is active.

              We also log full IP addresses used to sign up a product account. We keep this record forever because they are used to mitigate spammy signups.

              Web analytics data — described further in the Website Interactions section — are also tied temporarily to IP addresses to assist with troubleshooting cases. We blind all web analytics data after 30 days.
            </p>
            <h3>
              Website interactions
            </h3>
            <p>
              When you browse our marketing pages or applications, your browser automatically shares certain information such as which operating system and browser version you are using. We track that information, along with the pages you are visiting, page load timing, and which website referred you for statistical purposes like conversion rates and to test new designs. We sometimes track specific link clicks to help inform some design decisions. These web analytics data are tied to your IP address and user account if applicable and you are signed into our Services. We blind all of these individual identifiers after 30 days.

              Historically — including within the last 12 months — we have used third-party web analytics software. We no longer do for our actively sold and developed products and their marketing sites (Magicly). We are in the process of removing third party web analytics software from our other products and web properties.
            </p>
            <h3>
              Cookies and Do Not Track
            </h3>
            <p>
              We do use persistent first-party cookies to store certain preferences, make it easier for you to use our applications, and support some in-house analytics. A cookie is a piece of text stored by your browser to help it remember your login information, site preferences, and more. You can adjust cookie retention settings in your own browser. To learn more about cookies, including how to view which cookies have been set and how to manage and delete them, please visit: www.allaboutcookies.org.

              At this time, our sites and applications do not respond to Do Not Track beacons sent by browser plugins.
            </p>
            <h3>
              Voluntary correspondence
            </h3>
            <p>
              When you write Magicly with a question or to ask for help, we keep that correspondence, including the email address, so that we have a history of past correspondences to reference if you reach out in the future.

              We also store any information you volunteer like surveys. Sometimes when we do customer interviews, we may ask for your permission to record the conversation for future reference or use. We only do so if you give your express consent.
            </p>
            <h3>
              Information we do not collect
            </h3>
            <p>
              We don’t collect any characteristics of protected classifications including age, race, gender, religion, sexual orientation, gender identity, gender expression, or physical and mental abilities or disabilities. You may provide these data voluntarily, such as if you include a pronoun preference in your email signature when writing into our Support team.

              We also do not collect any biometric data. You are given the option to add a picture to your user profile, which could be a real picture of you or a picture of something else that represents you best. We do not extract any information from profile pictures: they are for your use alone.
            </p>

              <h2>
                When we access or share your information
            </h2>
              <p>
                Our default practice is to not access your information. The only times we’ll ever access or share your info are:
            </p>
              <p><span className={classes.boldFont}>To provide products or services you've requested.</span> We do use some third-party services to run our applications and only to the extent necessary process some or all of your personal information via these third parties. You can view the list of third-party services we use in Magicly. Having subprocessors means we are using technology to access your data. No Magicly human looks at your data for these purposes. We also use some other processors for other business functions, which you can view: Company processors.</p>
              <p><span className={classes.boldFont}>To help you troubleshoot or squash a software bug, with your permission.</span> If at any point we need to access your account to help you with a Support case, we will ask for your consent before proceeding.</p>
              <p><span className={classes.boldFont}>To investigate, prevent, or take action regarding restricted uses.</span> Accessing a customer’s account when investigating potential abuse is a measure of last resort. We have an obligation to protect the privacy and safety of both our customers and the people reporting issues to us. We do our best to balance those responsibilities throughout the process. If we do discover you are using our products for a restricted purpose, we will report the incident to the appropriate authorities.</p>
              <p><span className={classes.boldFont}>When required under applicable law.</span></p>
              <p>
                Sincero, LLC is a US company and all data infrastructure are located in the US.
            </p>
              <ul>
              <li>
                  If US law enforcement authorities have the necessary warrant, criminal subpoena, or court order requiring we share data, we have to comply. Otherwise, we flat-out reject requests from local and federal law enforcement when they seek data. And unless we’re legally prevented from it, we’ll always inform you when such requests are made. In the event a government authority outside the US approaches Sincero with a request, our default stance is to refuse unless the US government compels us to comply through procedures outlined in a mutual legal assistance treaty or agreement. We have never received a National Security Letter or Foreign Intelligence Surveillance Act (FISA) order.
              </li>
              <li>
                  Similarly, if Sincero receives a request to preserve data, we refuse unless compelled by either the US Federal Stored Communications Act, 18 U.S.C. Section 2703(f) or a properly served US subpoena for civil matters. In both of these situations, we have to comply. In these situations, we notify affected customers as soon as possible unless we are legally prohibited from doing so. We do not share preserved data unless absolutely required under the Stored Communications Act or compelled by a court order that we choose not to appeal. Furthermore, unless we receive a proper warrant, court order, or subpoena before the required preservation period expires, we destroy any preserved copies we made of customer data once the preservation period lapses.
              </li>
              <li>
                  If we get an informal request from any person, organization, or entity, we do not assist. If you are an account owner who wants to export data from their accounts, you can do so directly by emailing us at privacy@sincero.tech.
              </li>
            </ul>
              <p>
                Finally, if Sincero, LLC is acquired by or merged with another company — we don’t plan on that, but if it happens — we’ll notify you well before any info about you is transferred and becomes subject to a different privacy policy.
            </p>
              <h2>
                Your rights with respect to your information
            </h2>
              <p>
                At Sincero, we apply the same data rights to all customers, regardless of their location. Currently some of the most privacy-forward regulations in place are the European Union’s General Data Protection Regulation (“GDPR”) and California Consumer Privacy Act (“CCPA”) in the US. Sincero recognizes all of the rights granted in these regulations, except as limited by applicable law. These rights include:
              </p>
              <ul>
                <li>
                  <span className={classes.boldFont}>Right to Know.</span> You have the right to know what personal information is collected, used, shared or sold. We outline both the categories and specific bits of data we collect, as well as how they are used, in this privacy policy.
                </li>
                <li>
                  <span className={classes.boldFont}>Right of Access.</span> This includes your right to access the personal information we gather about you, and your right to obtain information about the sharing, storage, security and processing of that information.
                </li>
                <li>
                  <span className={classes.boldFont}>Right to Correction.</span> You have the right to request correction of your personal information.
                </li>
                <li>
                  <span className={classes.boldFont}>Right to Erasure / “To be Forgotten”.</span> This is your right to request, subject to certain limitations under applicable law, that your personal information be erased from our possession and, by extension, all of our service providers. Fulfillment of some data deletion requests may prevent you from using Sincero services because our applications may then no longer work. In such cases, a data deletion request may result in closing your account.
                </li>
                <li>
                  <span className={classes.boldFont}>Right to Complain.</span> You have the right to make a complaint regarding our handling of your personal information with the appropriate supervisory authority. To identify your specific authority or find out more about this right, EU individuals should go to https://edpb.europa.eu/about-edpb/board/members_en.
                </li>
                <li>
                  <span className={classes.boldFont}>Right to Restrict Processing.</span> This is your right to request restriction of how and why your personal information is used or processed, including opting out of sale of personal information. (Again: we never have and never will sell your personal data.)
                </li>
                <li>
                  <span className={classes.boldFont}>Right to Object.</span> You have the right, in certain situations, to object to how or why your personal information is processed.
                </li>
                <li>
                  <span className={classes.boldFont}>Right to Portability.</span> You have the right to receive the personal information we have about you and the right to transmit it to another party.
                </li>
                <li>
                  <span className={classes.boldFont}>Right to not be subject to Automated Decision-Making.</span> You have the right to object and prevent any decision that could have a legal, or similarly significant, effect on you from being made solely based on automated processes. This right is limited, however, if the decision is necessary for performance of any contract between you and us, is allowed by applicable law, or is based on your explicit consent.
                </li>
                <li>
                  <span className={classes.boldFont}>Right to Non-Discrimination.</span> This right stems from the CCPA. We do not and will not charge you a different amount to use our products, offer you different discounts, or give you a lower level of customer service because you have exercised your data privacy rights. However, the exercise of certain rights (such as the right “to be forgotten”) may, by virtue of your exercising those rights, prevent you from using our Services.
                </li>
              </ul>
              <p>Many of these rights can be exercised by signing in and directly updating your account information.</p>
              <p>If you have questions about exercising these rights or need assistance, please contact us at privacy@sincero.tech. For requests to delete personal information or know what personal information has been collected, we will first verify your identity using a combination of at least two pieces of information already collected including your user email address. If an authorized agent is corresponding on your behalf, we will first need written consent with a signature from the account holder before proceeding.</p>
              <p>If you are in the EU, you can identify your specific authority to file a complaint or find out more about GDPR, at https://edpb.europa.eu/about-edpb/board/members_en.</p>
              <h2>
                How we secure your data
            </h2>
              <p>All data is encrypted via SSL/TLS when transmitted from our servers to your browser. The database backups are also encrypted.</p>
              <p>For Magicly most data are not encrypted while they live in our database (since it needs to be ready to send to you when you need it), but we go to great lengths to secure your data at rest. For more information about how we keep your information secure, please review our security overview.</p>

              <h2>What happens when you delete data in your product accounts</h2>
              <p>In many of our applications, we give you the option to trash data. Anything you trash on your product accounts while they are active will be kept in an accessible trash can for up to 30 days (it varies a little by product). After that, the trashed data are no longer accessible via the application and are deleted from our active servers within the next 30 days. We also have some backups of our application databases, which are kept for up to another 30 days. In total, when you trash things in our applications, they are purged within 90 days from all of our systems and logs. Retrieving data for a single account from a backup is cost-prohibitive and unduly burdensome so if you change your mind you’ll need to do so before your data are deleted from our active servers.</p>
              <p>We also delete your data after an account is cancelled. In this case, there is no period of data being kept in an accessible trash can so your data are purged within 60 days. This applies both for cases when an account owner directly cancels and for auto-cancelled accounts. Please refer to our Cancellation policy for more details.</p>
              <h2>
                Location of site and data
              </h2>
              <p>Our products and other web properties are operated in the United States. If you are located in the European Union or elsewhere outside of the United States, please be aware that any information you provide to us will be transferred to and stored in the United States. By using our Site, participating in any of our services and/or providing us with your information, you consent to this transfer.</p>
              <h2>When transferring personal data from the EU</h2>
              <p>The GDPR requires that any data transferred out of the EU must be treated with the same level of protection that the EU privacy laws grant. The privacy laws of the United States generally do not meet that requirement. That is why since GDPR went into effect, Sincero has offered a data processing addendum and voluntarily participated in the EU-US Privacy Shield Framework as well as the Swiss-US Privacy Shield Framework.</p>
              <p>Our data processing addendum include the European Commission’s Standard Contractual Clauses to extend GDPR privacy principles, rights, and obligations everywhere personal data is processed.</p>

              <h2>EU-US and Swiss-US Privacy Shield policy</h2>
              <p>The EU-US Privacy Shield is an agreement between certain European jurisdictions and the United States that up until July 16, 2020, allowed for the transfer of personal data from the EU to the US. Participation in the Privacy Shield program is voluntary. The Swiss-US Privacy Shield is a similar program for data transferred to the US from Switzerland and is still in effect.</p>
              <h3>
                We comply with the frameworks for EU, UK, and Swiss data that are transferred into the United States
              </h3>
              <p>Sincero complies with the EU-U.S. Privacy Shield Framework and the Swiss-U.S. Privacy Shield Framework as set forth by the U.S. Department of Commerce regarding the collection, use, and retention of personal information transferred from the European Union, the United Kingdom, and Switzerland to the United States, respectively. We’ve certified to the Department of Commerce that we adhere to the Privacy Shield Principles. If there is any conflict between the terms in this privacy policy and the Privacy Shield Principles, the Privacy Shield Principles take precedent. To learn more about the Privacy Shield program, and to view our certification, please visit https://www.privacyshield.gov/.</p>
              <p>Sincero is subject to the investigatory and enforcement powers of the Federal Trade Commission (FTC) with regard to the Privacy Shield Frameworks.</p>
              <p>The Privacy Shield Frameworks uphold specific principles, many of which are already outlined in the section on Your Rights. For clarity, pursuant to the Privacy Shield Frameworks, the following principles apply to all EU, UK, and Swiss data that has been transferred into the United States:</p>
              <ul>
                <li>
                  Individuals have the right to access their personal data and to update, correct, and/or amend information that is incomplete. Individuals also have the right to request erasure of personal information that has been processed in violation of the principles. Individuals wishing to exercise these rights may do so by by signing in and directly updating your account information. If you have questions about exercising these rights or need assistance, please contact us at privacy@sincero.tech or at Sincero, LLC.
                </li>
                <li>We remain liable for the onward transfer of personal data to third parties acting as our agents unless we can prove we were not a party to the events giving rise to the damages.</li>
                <li>
                  We do not sell personal data nor do we permit it to be used for reasons other than those for which it was originally provided. If this practice should change in the future, we will update this policy accordingly and provide individuals with opt-out or opt-in choice as appropriate.
                </li>
                <li>We may be required to release personal data in response to lawful requests from public authorities including to meet national security and law enforcement requirements.</li>
              </ul>
              <h2>We commit to resolving all complaints</h2>
              <p>In compliance with the EU-US Privacy Shield Principles and the Swiss-US Privacy Shield Principles, we commit to resolve complaints about your privacy and our collection or use of your personal information. European Union, United Kingdom, or Swiss individuals with inquiries or complaints regarding this privacy policy should first contact us at Sincero at privacy@sincero.tech.</p>
              <p>Sincero (the company) has further committed to refer unresolved privacy complaints under the EU-US Privacy Shield Principles and the Swiss-US Privacy Shield Principles to an independent dispute resolution mechanism, the BBB EU PRIVACY SHIELD, operated by BBB National Programs. If you do not receive timely acknowledgment of your complaint, or if your complaint is not satisfactorily addressed, please visit https://bbbprograms.org/privacy-shield-complaints/ for more information and to file a complaint. This service is provided at no cost to you. Please do not submit GDPR complaints to BBB EU Privacy Shield.</p>
              <p>
                If your EU-US Privacy Shield complaint cannot be resolved through these described channels, under certain conditions, you may invoke binding arbitration for some residual claims not resolved by other redress mechanisms. To learn more, please view the Privacy Shield Annex 1 at https://www.privacyshield.gov/article?id=ANNEX-I-introduction.
              </p>
              <h2>Changes & questions</h2>
              <p>We may update this policy as needed to comply with relevant regulations and reflect any new practices. You can view a history of the changes to our policies since mid-2020. Please contact us so we can send them to you. Whenever we make a significant change to our policies, we will also announce them on our company blog.</p>
              <p>Have any questions, comments, or concerns about this privacy policy, your data, or your rights with respect to your information? Please get in touch by emailing us at privacy@sincero.tech and we’ll be happy to answer them!</p>
              <br />
              <h4 className={classes.centerText}>Adapted from the <a href="https://github.com/basecamp/policies">Basecamp open-source policies</a> / CC BY 4.0</h4>




          </Grid>
        </Grid>
      </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(PrivacyPage);