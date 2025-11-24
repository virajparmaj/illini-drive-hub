# **UIUC License Support Portal**

Helping UIUC students get their Illinois driver’s license — even without a car.

Bright orange + navy blue themed, full-stack Next.js platform for verified UIUC students to share resources, coordinate DMV help, and receive appointment alerts.

---

## 🚀 **Overview**

Many UIUC students—especially international, out-of-state, and master’s students—don’t own cars.
This makes the **Illinois road test** difficult because the DMV requires:

* A car
* Valid registration
* Valid insurance
* A licensed accompanying driver

The **UIUC License Support Portal** solves this problem by creating a **secure, UIUC-only community hub** where students can:

* Learn the **exact end-to-end process** of getting a license
* **Coordinate** with peers who can offer a ride or allow the use of their car
* **Post and track DMV appointment openings**
* Receive **email alerts** when new slots open
* Build connections in a safe, authenticated environment

No payments. No commercial activity. Just students helping students.

---

## ✨ **Features**

### 🔐 **UIUC-Only Authentication**

* Secure login via **NextAuth.js**
* Restricted to **@illinois.edu** accounts
* JWT-based session management
* Ensures users know exactly who they’re talking to

### 📘 **Step-by-Step License Guide**

A clear, student-friendly walkthrough:

1. Required documents
2. Written test
3. Vision test
4. Driving practice
5. Road test booking
6. DMV day checklist
7. After you pass

Built specifically for UIUC needs (international + graduate friendly).

### 🤝 **DMV Buddy Board**

A peer coordination board to:

* Request help for a road test
* Offer help if you have a car
* Share practice sessions
* Coordinate test-day rides

**No car verification, no liability, no payments**—purely a community board.

### 📅 **DMV Appointment Alerts**

* Users subscribe to a date range
* Others can report when appointment slots open
* Subscribers automatically receive **email notifications**
* Helps avoid constantly refreshing the DMV website

### 👤 **User Profiles**

* Name, email, preferences
* Manage posts
* Manage appointment alert settings

---

## 🧱 **Tech Stack**

### **Frontend**

* React
* Next.js (App Router)
* Tailwind CSS

### **Backend**

* Node.js
* Next.js API Routes
* NextAuth.js
* JWT sessions

### **Database**

* PostgreSQL
* ORM or SQL migrations (developer choice)

### **Deployment**

* Vercel
* GitHub repo for CI/CD

### **Security**

* Protected routes via middleware
* UIUC-only domain restriction
* Secure cookies
* Server-side validation

---

## 🎨 **Design & Theme**

Bright **orange** and **navy blue**, inspired by UIUC colors.

* Navy backgrounds
* Orange buttons, links, and highlights
* Clean typography, accessible contrast
* Mobile-first responsive layout

---

## ⚙️ **Environment Variables**

Rename `.env.example` → `.env.local` and set:

```
DATABASE_URL=postgres://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-vercel-url.vercel.app
EMAIL_SERVER=...
EMAIL_FROM=...
```

(Or Google OAuth restricted to `@illinois.edu`)

---

## ❗ **Disclaimers**

This platform is:

* Student-created
* Not affiliated with UIUC or the Illinois DMV
* Not responsible for verifying vehicle compliance
* Not liable for user arrangements or damages
* Free and non-commercial

**All interactions between users are voluntary and at their own risk.**

---

## 🧪 **Running Locally**

1. Clone repo
2. Install dependencies:

   ```
   npm install
   ```
3. Add environment variables
4. Run migrations
5. Start dev server:

   ```
   npm run dev
   ```

## 🤝 **Contributions**

Open to pull requests from the UIUC community.
Request features, create issues, or contribute guides.

---

## 🧡 Built for UIUC Students

A safe, student-only platform to make the driver’s license process easier, cheaper, and more accessible.
