<?php 


//Адрес электронной почты. Введите адрес электронной почты
define("__TO__", "hello@mail.com");

//Сообщение об успехе
define('__SUCCESS_MESSAGE__', "Ваше сообщение было отправлено. Мы ответим в ближайшее время. Благодарю вас!");

//Сообщение об ошибке
define('__ERROR_MESSAGE__', "Ваше сообщение не отправлено. Пожалуйста, попробуйте еще раз.");

//Сообщение, когда одно или несколько полей пусты
define('__MESSAGE_EMPTY_FIELDS__', "Пожалуйста, заполните все поля");

//Проверка электронной почты
function check_email($email){
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
        return false;
    } else {
        return true;
    }
}

//Проверка имени
function check_name($data){
  if(!preg_match("/^[a-zA-Z ]*$/",$data)){
      return false;
  } else {
      return true;
  }
}

//Проверка ввода
function check_input($text) {
  $text = trim($text);
  $text = stripslashes($text);
  $text = htmlspecialchars($text);
  return $text;
}

//Отправить почту
function send_mail($to,$subject,$message,$headers){
    if(@mail($to,$subject,$message,$headers)){
        echo json_encode(array('info' => 'success', 'msg' => __SUCCESS_MESSAGE__));
    } else {
        echo json_encode(array('info' => 'error', 'msg' => __ERROR_MESSAGE__));
    }
}

//Получить форму данных и отправить письмо
if(isset($_POST['name']) and isset($_POST['mail']) and isset($_POST['message'])){
    $name = check_input($_POST['name']);
    $mail = check_input($_POST['mail']);
    $messageForm = check_input($_POST['message']);

    if($name == '') {
        echo json_encode(array('info' => 'error', 'msg' => "Please enter your name.", 'id' =>"#name"));
        exit();
    } else if(!check_name($name)) {
      echo json_encode(array('info' => 'error', 'msg' => "Please enter a valid name.", 'id' =>"#name"));
      exit();
    } else if($mail == '' or check_email($mail) == false){
        echo json_encode(array('info' => 'error', 'msg' => "Please enter valid e-mail.", 'id' =>"#mail"));
        exit();
    } else if($messageForm == ''){
        echo json_encode(array('info' => 'error', 'msg' => "Please enter your message.", 'id' =>"#message"));
        exit();
    } else {
        $to = __TO__;
        $subject = 'Contact Form | ' . $name;
        $message = '
        <html>
        <head>
          <title>Mail from '. $name .'</title>
        </head>
        <body>
          <table style="width: 500px; font-family: arial; font-size: 14px;" border="1">
            <tr style="height: 32px;">
              <th align="right" style="width:150px; padding-right:5px;">Name:</th>
              <td align="left" style="padding-left:5px; line-height: 20px;">'. $name .'</td>
            </tr>
            <tr style="height: 32px;">
              <th align="right" style="width:150px; padding-right:5px;">E-mail:</th>
              <td align="left" style="padding-left:5px; line-height: 20px;">'. $mail .'</td>
            </tr>
            <tr style="height: 32px;">
              <th align="right" style="width:150px; padding-right:5px;">Message:</th>
              <td align="left" style="padding-left:5px; line-height: 20px;">'. $messageForm  .'</td>
            </tr>
          </table>
        </body>
        </html>
        ';

        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
        $headers .= 'From: ' . $mail . "\r\n";

        send_mail($to,$subject,$message,$headers);
    }
} else {
    echo json_encode(array('info' => 'error', 'msg' => __MESSAGE_EMPTY_FIELDS__));
}
 ?>