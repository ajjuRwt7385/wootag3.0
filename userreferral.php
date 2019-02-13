<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Wootag | Register for a new Wootag account</title>

    <meta name="keywords" content="">
    <meta name="description" content="Register to start using Wootag, the interactive video platform that lets viewers make purchases and interact with brands across multiple social media platforms.">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32x32.png">

    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css?family=Rubik:300,400,500,700" rel="stylesheet">
    <!-- Material icons CSS -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!-- AOS (Animation On Scroll) -->
    <link href="/assets/css/aos.css" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/main.css">

    <meta property="og:locale" content="en_US">
    <meta property="og:url" content="//www.wootag.com">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Create interactive and shoppable videos to share - with Wootag">
    <meta property="og:site_name" content="Wootag">
    <meta property="og:description" content="Sign in to Wootag, the interactive video platform that lets viewers make purchases and interact with brands across multiple social media forms.">
    <!-- twitter  -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@wootag">
    <meta name="twitter:title" content="Register for a new Wootag account.">
    <meta name="twitter:description" content="Register to start using Wootag, the interactive video platform that lets viewers make purchases and interact with brands across multiple social media platforms.">
    <!-- <meta name="twitter:image:src" content="../assets/share_wt.jpg"/> -->
  </head>
  <body class="signup loading-page">
    <div class="container-fluid">
      <main class="row">
        <div class="container-fluid sign-in-up-container">
          <div class="row">
            <div class="container">
              <!-- Signup Form -->
              <div class="row row-centered zIndexOne">
                <div class="col-sm-12 col-md-6 row__padTB100">   
                  <div class="wt-navbar-logo">
                    <a class="wt-navbar-brand" href="/"></a>
                  </div>              
                  <h1 class="wt-title wt-title__large">Join to start collaborating</h1>
                  <form class="wt-form signin__form" method="POST" accept-charset="UTF-8" action="/api/v1/referralregistration" autocomplete="off" role="Form">                  
                    <div class="form-group">
                      <input required type="text" name="username" class="form-control" placeholder="Name" />
                    </div>
                    <div class="form-group">
                      <input required type="email" name="email" placeholder="Your Email" class="form-control" value="<?php echo $email; ?>" readonly />
                    </div>
                    <div class="form-group">
                      <input required type="password" name="password" class="form-control" placeholder="Password" />
                    </div>
                    <input type="hidden" name="org_id" value="<?php echo $org_id; ?>" />
                    <input type="hidden" name="invitation_id" value="<?php echo $invitation_id; ?>" />
                    <input type="hidden" name="inviter_id" value="<?php echo $inviter_id; ?>" />
                    <input type="hidden" name="brand_id" value="<?php echo $brand_id; ?>" />
                    <ul class="form__error"><?php if(isset($error)) echo "<li>$error;</li>" ?></ul>
                    <button type="submit" onclick="return checkPass();" class="button wt-button">SIGN UP NOW</button>
                  </form> 
                </div>
                <!-- <div class="col-sm-12 col-md-6">
                  <div class="bg-gray"></div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </main>   
    </div>
  </body>
</html>
              
