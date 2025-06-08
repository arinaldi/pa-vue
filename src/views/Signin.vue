<script lang="ts" setup>
import { ref } from 'vue';
import EmailForm from './signin/EmailForm.vue';
import OtpForm from './signin/OtpForm.vue';
import PasswordForm from './signin/PasswordForm.vue';
import { type View } from './signin/schema';

const view = ref<View>('email');
const email = ref('');

function setView(newView: View, newEmail: string) {
  view.value = newView;
  email.value = newEmail;
}

function onCancel(newEmail: string) {
  view.value = 'email';
  email.value = newEmail;
}
</script>

<template>
  <EmailForm v-if="view === 'email'" :email="email" @setView="setView" />
  <OtpForm v-if="view === 'otp'" @cancel="onCancel" :email="email" />
  <PasswordForm v-if="view === 'password'" @cancel="onCancel" :email="email" />
</template>
