module.exports = {
    // Database setting
    'host' : '127.0.0.1',
    'user' : 'root',
    'password' : 'root',
    'db' : 'hw5',

    /***********************************************************
    *
    * Outgoing email setting (using nodemailer module)
    *
    *  Using Gmail might or might not work out of the box. 
    *  See instructions for setting up Gmail SMTP here:
    *  https://nodemailer.com/usage/using-gmail/
    *
    *  The default setting should be working, unless Gmail has been blocked 
    *  this account, for example sending more than 300 emails by this app.
    *
    *************************************************************/
    'email_type' : 'Gmail',
    'outgoing_email' : 'epso2017@gmail.com',
    'email_password' : '789789789',    

    // Frequency setting, please don't set too low. (in milliseconds Unit)
    'check_in_frequency' : 10000,
    'notify_delay' : 20000,
    'email_job_frequency' : 3000,

    // Credit card setting, Stripe API keys, don't forget to fill in
    'secret_key' : 'sk_test_RGzr8LWVtezFDCXP8BSuoyUn',
    'public_key' : 'pk_test_OuteujQr7nmLCtvDqqPgdlRv'
}