<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>Example PHP Federated Application</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
</head>
<body>
    <?php
        // $name = "Jieling";
        // print "<h1>Hello " . $name . "!!!</h1>";

        // print "<p>Let see all other attributes:</p>";
        // print "<p>Your REMOTE_USER is <strong>" . $_SERVER["REMOTE_USER"] . "</strong></p>";
        // print "<p>Your email is <strong>" . $_SERVER['mail'] . "</strong></p>";
        // print "<p>Your eduPersonPrincipalName is <strong>" . $_SERVER["eppn"] . "</strong></p>";
        // print "<p>Your schacHomeOrganization is <strong>" . $_SERVER["schacHomeOrganization"] . "</strong></p>";
        // print "<p>Your schacHomeOrganizationType is <strong>" . $_SERVER["schacHomeOrganizationType"] . "</strong></p>";

        $eppn = $_SERVER["eppn"];
    ?>

    <script type="text/javascript">
        var eppn = "<?php echo $eppn; ?>";
        var at = eppn.indexOf("@");
        var uwid = eppn.substring(0, at);
        // window.sessionStorage.setItem("uwid", uwid);

        var onSuccess = function(data) {
            if (data.status) {
                window.sessionStorage.clear();
                console.log(data);
                window.sessionStorage.setItem('infomation',JSON.stringify(data.data));

                window.location.replace("./UW-Capstone-Web-Portal/vuexy-html-admin/html/ltr/login/chooseRole.html");
            } else {
                alert(data.data);
            }

        }

        //this function will be called when data exchange with backend occured an error
        var onFaliure = function() {
            alert("Backend faliure !");
        }

        const baseURL = "https://uwcoe-api.azurewebsites.net/api/";

        var makeGetRequest = function(url, onSuccess, onFailure) {
            $.ajax({
                async:false,
                type: 'GET',
                url: baseURL + url,
                dataType: "json",
                success: onSuccess,
                error: onFailure
            });
        };

        makeGetRequest("login/" + uwid, onSuccess, onFaliure);

    </script>
</body>
</html>