# Website Errors Report

The following issues were identified during a review of the website layout and functionality:

- **[RESOLVED] Contact Us and Consultation Buttons**: Clicking these buttons previously triggered a **404 error** because the `/contact` page was not implemented.
  - *Resolution*: Implemented the dynamic contact form page at `app/contact/page.tsx`, connected to the `@emailjs/browser` SDK and integrated with `sweetalert2` for alerts.
