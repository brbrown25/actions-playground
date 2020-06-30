import $ from 'jquery';
import zxcvbn from 'zxcvbn';

$(document).ready(function ($) {
  //disable the submit button on page load
  $('#submit-password-reset').prop('disabled', true);
  /**
   * Convert the Result from zxcvbn into a human readable string.
   */
  const createPasswordLabel = (result) => {
    switch (result.score) {
      case 0:
        return 'Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return 'Weak';
    }
  };
  /**
   * Compare the two password fields to make sure
   * they match and we set the correct password.
   */
  const checkPasswordsMatch = (f1, f2) => {
    return f1.val() == f2.val();
  };

  let password = $('#password');
  let confirmPassword = $('#confirm_password');
  let passwordStrengthProgress = $('#password-strength-progress');
  let passwordStrengthLabel = $('.password-strength-meter-label');
  let passwordSuggestion = $('#password-suggestion');
  let passwordSuggestionAlert = $('#password-suggestion-warning');
  let passwordMismatch = $('#password-warning');
  let passwordMismatchAlert = $('#password-mismatch');
  let submitBtn = $('#submit-password-reset');

  password.keyup(function (e) {
    let testResult = zxcvbn(e.currentTarget.value);
    let passwordLabel = createPasswordLabel(testResult);
    passwordStrengthProgress.val(testResult.score);
    passwordStrengthProgress.addClass(
      `password-strength-meter-progress strength-${passwordLabel.toLowerCase()}`,
    );
    let meterLabel = `<strong>Password Strength:</strong> ${passwordLabel}`;

    if (password) {
      if (testResult.score < 3) {
        passwordSuggestion.html(testResult.feedback.suggestions);
        passwordSuggestionAlert.removeClass('fade');
      } else {
        passwordSuggestionAlert.addClass('fade');
        passwordStrengthLabel.html('');
        passwordSuggestion.html('');
      }
      passwordStrengthLabel.html(meterLabel);
    } else {
      passwordSuggestionAlert.addClass('fade');
      passwordStrengthLabel.html('');
      passwordSuggestion.html('');
    }
  });

  confirmPassword.keyup(function (e) {
    passwordMismatchAlert.addClass('fade');
    passwordMismatch.html('');
    let testResult = zxcvbn($(password).val());
    let passwordsMatch = checkPasswordsMatch($(password), $(confirmPassword));
    /**
     * Only enable the submit button once the passwords match and
     * it has a good password strength.
     */
    if (testResult.score >= 3 && passwordsMatch) {
      submitBtn.prop('disabled', false);
    } else {
      //add in a nice message
      submitBtn.prop('disabled', true);
      passwordMismatch.html('Passwords do not match, please try typing again.');
      passwordMismatchAlert.removeClass('fade');
    }
  });
});
