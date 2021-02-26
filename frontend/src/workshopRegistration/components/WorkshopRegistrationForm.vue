<template>
    <form method="post" action="" class="sample">
        <label for="fullName" class="required">Full name:</label>
        <input type="text" name="fullName" required="required" maxlength="100" id="fullName">

        <label for="phoneNumber" class="required">Phone number:</label>
        <input type="text" name="phoneNumber" required="required" maxlength="50" id="phoneNumber">

        <label for="emailAddress" class="required">Email address:</label>
        <input type="text" name="emailAddress" required="required" maxlength="320" id="emailAddress">

        <label for="password" class="required">Password:</label>
        <input type="password" name="password" required="required" maxlength="255" id="password">
    </form>
</template>

<script>
export default {
  name: 'WorkshopRegistrationForm'
}
</script>
