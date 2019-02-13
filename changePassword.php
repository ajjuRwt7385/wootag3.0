<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Wootag | Reset Password</title>

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

<body data-page="reset_password">    
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
                <h1 class="wt-title wt-title__large">Please enter your new password.</h1>
                <form class="wt-form signin__form" method="POST" accept-charset="UTF-8" action="" autocomplete="off" role="Form">                  
                  <div class="form-group">
                      <input required type="password" id="password" name="password" class="form-control" placeholder="Password"/>
                    </div>
                  <div class="form-group">
                    <input required type="password" id="confirm-password" name="confirm-password" class="form-control" placeholder="Confirm Password"/>
                  </div> 
                  <ul class="form__error"><li id="errorLi" style="display:none;"><span id="confirmMessage" class="confirmMessage"></span></li></ul>
                  <button type="submit" onclick="return checkPass();" class="button wt-button">SET NEW PASSWORD</button>
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
  <script type="text/javascript">
    function checkPass() {
      var pass1 = document.getElementById('password');
      var pass2 = document.getElementById('confirm-password');
      var message = document.getElementById('confirmMessage');
      var errorLi = document.getElementById('errorLi');
      var okColor = "#66cc66";
      var errorColor = "#ff6666";
      if(pass1.value == pass2.value) {
        // message.style.color = okColor;
        errorLi.style.display = 'none';
        message.innerHTML = "";
        return true;
      }
      else {
        // message.style.color = errorColor;
        errorLi.style.display = 'block';
        message.innerHTML = "Passwords Do Not Match!";
        return false;
      }
    }  
  </script>
</body>
</html>