<?php
// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    // Set recipient email address
    $to = "hank170305@email.com";

    // Set email subject
    $subject = "New message from $name";

    // Set email message
    $email_message = "Name: $name\n";
    $email_message .= "Email: $email\n";
    $email_message .= "Message:\n$message";

    // Set headers
    $headers = "From: $name <$email>\r\nReply-To: $email\r\n";

    // Send email
    if (mail($to, $subject, $email_message, $headers)) {
        // Email sent successfully
        echo "Thank you! Your message has been sent.";
    } else {
        // Email sending failed
        echo "Oops! Something went wrong.";
    }
} else {
    // If the form is not submitted
    echo "This script should only be accessed via a form submission.";
}

// Assuming everything went fine
$response = array("success" => true);

// If an error occurred, set success to false
// $response = array("success" => false);

// Output JSON response
header('Content-Type: application/json');
echo json_encode($response);

?>


