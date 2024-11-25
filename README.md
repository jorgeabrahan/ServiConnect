<a name="readme-top"></a>

# 📗 Table of Contents

- [📗 Table of Contents](#-table-of-contents)
- [📖 ServiConnect ](#-serviconnect-)
  - [🛠 Built With ](#-built-with-)
    - [Tech Stack ](#tech-stack-)
    - [Key Features ](#key-features-)
  - [💻 Getting Started ](#-getting-started-)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Install](#install)
    - [Usage](#usage)
    - [Deployment](#deployment)
  - [👥 Authors ](#-authors-)
  - [🔭 Future Features ](#-future-features-)
  - [🤝 Contributing ](#-contributing-)
  - [⭐️ Show your support ](#️-show-your-support-)
  - [🙏 Acknowledgments ](#-acknowledgments-)
  - [📝 License ](#-license-)

# 📖 ServiConnect <a name="about-project"></a>

**ServiConnect** Connecting platform with trusted local service providers like
electricians, plumbers, gardeners, and more. Find and request services easily.

## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

<details>
  <summary>Client</summary>
  <ul>
    <li>NextJS</li>
    <li>Typescript</li>
    <li>Zustand</li>
    <li>Tailwind</li>
    <li>Headless UI</li>
    <li>ImageKit</li>
  </ul>
</details>

<details>
  <summary>Database</summary>
  <ul>
    <li>NestJS</li>
    <li>Typescript</li>
    <li>PostgreSQL</li>
    <li>Jest</li>
    <li>TypeORM</li>
    <li>JWT</li>
    <li>Passport</li>
    <li>Swagger</li>
    <li>Class Validator</li>
    <li>Aiven</li>
  </ul>
</details>

### Key Features <a name="key-features"></a>

- **Secure Authentication through JWT & Passport**
- **Swagger API Documentation**
- **Service Providers management**
- **Service Requests management**
- **User roles and permissions**
- **Restricted routes**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 💻 Getting Started <a name="getting-started"></a>

To get a local copy up and running, follow these steps.

### Prerequisites

Copy the `.env.example` file to `.env` and fill in the values in both projects
'servi-connect' and 'serviconnectbackend'. The env values will be provided
through the email.

### Setup

Clone this repository to your desired folder:

```
git clone https://github.com/jorgeabrahan/ServiConnect.git
```

Or download the ZIP folder.

### Install

Once you've cloned the repository simply run the following commands in the root
folder:

```
## Install dependencies from root folder
npm i

## Install dependencies from each project
npm run install:all
```

### Usage

To run the project, in the root folder execute the following command:

```
npm run start
```

Now you should be able to access the frontend at
[http://localhost:3001](http://localhost:3001) and the backend at
[http://localhost:3000](http://localhost:3000)

### Deployment

- Backend (Vercel)
  ([https://serviconnect-production.up.railway.app/api](https://serviconnect-production.up.railway.app/api))
- Frontend (Vercel)
  ([https://servi-connect.vercel.app/](https://servi-connect.vercel.app/))

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 👥 Authors <a name="authors"></a>

👤 **Jorge Abrahan**

- GitHub: [@jorgeabrahan](https://github.com/jorgeabrahan)
- LinkedIn:
  [Jorge Abrahan](https://www.linkedin.com/in/jorge-siguenza/?locale=en_US)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🔭 Future Features <a name="future-features"></a>

- [ ] **Create more tests**
- [ ] **Polish the UI & UX**
- [ ] **Add extra functionalities**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🤝 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome!

Feel free to create an issue or a pull request.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- SUPPORT -->

## ⭐️ Show your support <a name="support"></a>

If you like this project you can just cheer me up with a star 🙂!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🙏 Acknowledgments <a name="acknowledgements"></a>

This is a Code exitos assesment project

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 📝 License <a name="license"></a>

This project is [MIT](./LICENSE) licensed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
