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

const TermsPage = () => {
  const classes = useStyles();
  return (
    <Layout>
      <div className={classes.privacyPage}>
        <Grid container justify="center" alignContent="center" alignItems="center">
          <Grid item xs={12}>
            <MagiclyPageTitle
              title={'Terms of Service'}
            />
          </Grid>
        </Grid>

        <div className={classes.root}>
          <Grid container>
            <Grid item xs={12}>
              <p><em>Last updated: December 4, 2020</em></p>

              <p>From everyone at Magicly, thank you for using our products! We build them to help you do your best work. There are millions of people using Magicly products every day. Because we don't know every one of our customers personally, we have to put in place some Terms of Service to help keep the ship afloat.</p>

              <p>When we say “Company”, “we”, “our”, or “us” in this document, we are referring to Sincero, LLC, the Company that is developing Magicly.</p>

              <p>When we say “Services”, we mean any product created and maintained by Sincero, LLC. That includes Magicly (all versions), whether delivered within a web browser, desktop application, mobile application, or another format.</p>

              <p>When we say “You” or “your”, we are referring to the people or organizations that own an account with one or more of our Services.</p>

              <p>We may update these Terms of Service in the future. Whenever we make a significant change to our policies, we will also announce them on our <a href="https://magicly.medium.com/">company blog</a> and send you an email.</p>

              <p>When you use our Services, now or in the future, you are agreeing to the latest Terms of Service. That's true for any of our existing and future products and all features that we add to our Services over time. There may be times where we do not exercise or enforce any right or provision of the Terms of Service; in doing so, we are not waiving that right or provision. <strong>These terms do contain a limitation of our liability.</strong></p>

              <p>If you violate any of the terms, we may terminate your account. That's a broad statement and it means you need to place a lot of trust in us. We do our best to deserve that trust by being open about who we are and keeping an open door to <a href="https://magicly.app/support">your feedback</a>.</p>

              <h2>Account Terms</h2>

              <ol>
                <li>You are responsible for maintaining the security of your account and password. The Company cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</li>
                <li>You are responsible for all content posted and activity that occurs under your account. That includes content posted by others who either: (a) have access to your login credentials; or (b) have their own logins under your account.</li>
                <li>You must be a human. Accounts registered by “bots” or other automated methods are not permitted.</li>
              </ol>

              <h2>Payment, Refunds, and Plan Changes</h2>

              <ol>
                <li>If you are using a free version of one of our Services, it is really free: we do not ask you for your credit card and — just like for customers who pay for our Services — we do not sell your data.</li>
                <li>For paid Services that offer a free trial, we explain the length of trial when you sign up. After the trial period, you need to pay in advance to keep using the Service. If you do not pay, we will freeze your account and it will be inaccessible until you make payment. If your account has been frozen for a while, we will queue it up for auto-cancellation. See our <a href="../cancellation/index.md">Cancellation policy</a> for more details.</li>
                <li>If you are upgrading from a free plan to a paid plan, we will charge your card immediately and your billing cycle starts on the day of upgrade. For other upgrades or downgrades in plan level, the new rate starts from the next billing cycle.</li>
                <li>All fees are exclusive of all taxes, levies, or duties imposed by taxing authorities. Where required, we will collect those taxes on behalf of the taxing authority and remit those taxes to taxing authorities.</li>
                <li>We process refunds according to our Fair Refund policy.</li>
              </ol>

              <h2>Cancellation and Termination</h2>

              <ol>
                <li>You are solely responsible for properly canceling your account. Within each of our Services, we provide a simple no-questions-asked cancellation link. You can find instructions for how to cancel your account in our Cancellation policy. An email or phone request to cancel your account is not automatically considered cancellation. If you need help cancelling your account, you can always <a href="https://magicly.app/support">contact our Support team</a>.</li>
                <li>All of your content will be inaccessible from the Services immediately upon cancellation. Within 30 days, all content will be permanently deleted from active systems and logs. Within 60 days, all content will be permanently deleted from our backups. We cannot recover this information once it has been permanently deleted. If you want to export any data before your account is cancelled, please contact support us.
                </li>
                <li>If you cancel the Service before the end of your current paid up month, your cancellation will take effect immediately, and you will not be charged again. We do not automatically prorate unused time in the last billing cycle.</li>
                <li>We have the right to suspend or terminate your account and refuse any and all current or future use of our Services for any reason at any time. Suspension means you and any other users on your account will not be able to access the account or any content in the account. Termination will furthermore result in the deletion of your account or your access to your account, and the forfeiture and relinquishment of all content in your account. We also reserve the right to refuse the use of the Services to anyone for any reason at any time. We have this clause because statistically speaking, out of the hundreds of thousands of accounts on our Services, there is at least one doing something nefarious. There are some things we staunchly stand against and this clause is how we exercise that stance.</li>
                <li>Verbal, physical, written or other abuse (including threats of abuse or retribution) of Company employee or officer will result in immediate account termination.</li>
              </ol>

              <h2>Modifications to the Service and Prices</h2>

              <ol>
                <li>We make a promise to our customers to support our Services to the best of our ability. That means when it comes to security, privacy, and customer support, we will continue to maintain any legacy Services. Sometimes it becomes technically impossible to continue a feature or we redesign a part of our Services because we think it could be better or we decide to close new signups of a product. We reserve the right at any time to modify or discontinue, temporarily or permanently, any part of our Services with or without notice.</li>
                <li>Sometimes we change the pricing structure for our products. When we do that, we tend to exempt existing customers from those changes. However, we may choose to change the prices for existing customers. If we do so, we will give at least 30 days notice and will notify you via the email address on record. We may also post a notice about changes on our websites or the affected Services themselves.</li>
              </ol>

              <h2>Uptime, Security, and Privacy</h2>

              <ol>
                <li>Your use of the Services is at your sole risk. We provide these Services on an “as is” and “as available” basis. We do not offer service-level agreements for most of our Services.</li>
                <li>We reserve the right to temporarily disable your account if your usage significantly exceeds the average usage of other customers of the Services. Of course, we'll reach out to the account owner before taking any action except in rare cases where the level of use may negatively impact the performance of the Service for other customers.</li>
                <li>We take many measures to protect and secure your data through backups, redundancies, and encryption. We enforce encryption for data transmission from the public Internet. There are some edge cases where we may send your data through our network unencrypted. Please refer to our Security Overview for full detail.</li>
                <li><p>When you use our Services, you entrust us with your data. We take that trust to heart. You agree that Magicly may process your data as described in our <a href="privacy">Privacy Policy</a> and for no other purpose. We as humans can access your data for the following reasons:</p>

                  <ul><li><strong>To help you with support requests you make.</strong> We'll ask for express consent before accessing your account.</li>
                    <li><strong>On the rare occasions when an error occurs that stops an automated process partway through.</strong> We get automated alerts when such errors occur. When we can fix the issue and restart automated processing without looking at any personal data, we do. In rare cases, we have to look at a minimum amount of personal data to fix the issue. In these rare cases, we aim to fix the root cause as much as possible to avoid the errors from reoccurring.</li>
                    <li><strong>To safeguard Magicly.</strong> We'll look at logs and metadata as part of our work to ensure the security of your data and the Services as a whole. If necessary, we may also access accounts as part of an abuse report investigation.</li>
                    <li><strong>To the extent required by applicable law.</strong> As a US company with all data infrastructure located in the US, we only preserve or share customer data if compelled by a US government authority with a legally binding order or proper request under the Stored Communications Act. If a non-US authority approaches Magicly for assistance, our default stance is to refuse unless the order has been approved by the US government, which compels us to comply through procedures outlined in an established mutual legal assistance treaty or agreement mechanism. If Magicly is audited by a tax authority, we only share the bare minimum billing information needed to complete the audit.</li></ul></li>
                <li><p>We use third party vendors and hosting partners to provide the necessary hardware, software, networking, storage, and related technology required to run the Services.</p></li>
                <li>Under the California Consumer Privacy Act (“CCPA”), Magicly is a “service provider”, not a “business” or “third party”, with respect to your use of the Services. That means we process any data you share with us only for the purpose you signed up for and as described in these Terms of Service, <a href="privacy">Privacy policy</a>. We do not retain, use, disclose, or sell any of that information for any other commercial purposes unless we have your explicit permission. And on the flip-side, you agree to comply with your requirements under the CCPA and not use Basecamp’s Services in a way that violates the regulations.</li>
                <li>These Service Terms incorporate the Magicly Data Processing Addendum (“DPA”), when the General Data Protection regulation (“GDPR”) applies to your use of Magicly Services to process Customer Data as defined in the DPA. The DPA is effective as of October 5, 2020 and replaces and supersedes any previously agreed data processing addendum between you and Sincero, LLC relating to the GDPR. If you prefer to have an executed copy of the Data Processing Addendum, email us and we will send you a copy to sign. Regardless of whether you execute or not, we protect and secure your data to the high standards set out in the addendum.</li>
              </ol>

              <h2>Copyright and Content Ownership</h2>

              <ol>
                <li>All content posted on the Services must comply with U.S. copyright law.</li>
                <li>We claim no intellectual property rights over the material you provide to the Services. All materials uploaded remain yours.</li>
                <li>We do not pre-screen content, but reserve the right (but not the obligation) in our sole discretion to refuse or remove any content that is available via the Service.</li>
                <li>The names, look, and feel of the Services are copyright© to the Company. All rights reserved. You may not duplicate, copy, or reuse any portion of the HTML, CSS, JavaScript, or visual design elements without express written permission from the Company. You must request permission to use the Company's logo or any Service logos for promotional purposes. Please <a href="https://magicly.app/support">email us</a> requests to use logos. We reserve the right to rescind this permission if you violate these Terms of Service.</li>
                <li>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Services, use of the Services, or access to the Services without the express written permission by the Company.</li>
                <li>You must not modify another website so as to falsely imply that it is associated with the Services or the Company.</li>
              </ol>

              <h2>Features and Bugs</h2>

              <p>We design our Services with care, based on our own experience and the experiences of customers who share their time and feedback. However, there is no such thing as a service that pleases everybody. We make no guarantees that our Services will meet your specific requirements or expectations.</p>

              <p>We also test all of our features extensively before shipping them. As with any software, our Services inevitably have some bugs. We track the bugs reported to us and work through priority ones, especially any related to security or privacy. Not all reported bugs will get fixed and we don't guarantee completely error-free Services.</p>

              <h2>Services Adaptations and API Terms</h2>

              <p>We offer Application Program Interfaces ("API"s) for some of our Services (currently Magicly. Any use of the API, including through a third-party product that accesses the Services, is bound by the terms of this agreement plus the following specific terms:</p>

              <ol>
                <li>You expressly understand and agree that we are not liable for any damages or losses resulting from your use of the API or third-party products that access data via the API.</li>
                <li>Third parties may not access and employ the API if the functionality is part of an application that remotely records, monitors, or reports a Service user's activity <em>other than time tracking</em>, both inside and outside the applications. The Company, in its sole discretion, will determine if an integration service violates this bylaw. A third party that has built and deployed an integration for the purpose of remote user surveillance will be required to remove that integration.</li>
                <li>Abuse or excessively frequent requests to the Services via the API may result in the temporary or permanent suspension of your account's access to the API. The Company, in its sole discretion, will determine abuse or excessive usage of the API. If we need to suspend your account's access, we will attempt to warn the account owner first. If your API usage could or has caused downtime, we may cut off access without prior notice.</li>
              </ol>

              <h2>Liability</h2>

              <p>We mention liability throughout these Terms but to put it all in one section:</p>

              <p><strong><em>You expressly understand and agree that the Company shall not be liable, in law or in equity, to you or to any third party for any direct, indirect, incidental, lost profits, special, consequential, punitive or exemplary damages, including, but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses (even if the Company has been advised of the possibility of such damages), resulting from: (i) the use or the inability to use the Services; (ii) the cost of procurement of substitute goods and services resulting from any goods, data, information or services purchased or obtained or messages received or transactions entered into through or from the Services; (iii) unauthorized access to or alteration of your transmissions or data; (iv) statements or conduct of any third party on the service; (v) or any other matter relating to this Terms of Service or the Services, whether as a breach of contract, tort (including negligence whether active or passive), or any other theory of liability.</em></strong></p>

              <p>In other words: choosing to use our Services does mean you are making a bet on us. If the bet does not work out, that's on you, not us. We do our darnedest to be as safe a bet as possible through careful management of the business; investments in security, infrastructure, and talent; and in general giving a damn. If you choose to use our Services, thank you for betting on us.</p>

              <p>If you have a question about any of the Terms of Service, please <a href="https://magicly.app/support">contact our Support team</a>.</p>

            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(TermsPage);