import sgMail from '@sendgrid/mail';
import {SENDGRID_API, HOST_EMAIL} from '../constants';

sgMail.setApiKey(SENDGRID_API);

const sendMail = async (email, subject, text, html) => {
  try{
    const msg = {
      html,
      text,
      subject,   
      to: email,
      from: HOST_EMAIL,
    };
    await sgMail.send(msg);
    consola.success("email sent.")
  } catch(err){
    consola.error("error mailing. ", err.message)
  } finally {
    return;
  }
};
export default sendMail;