# Car Workshop Management Application

## Overview

This project is a web-based application designed to help manage a car workshop. It's built using React for the frontend and ASP.NET Core for the backend. The application allows for efficient handling of employees, tickets, and parts. This project was created for the Graphical User Interfaces (EGUI) course at the Computer Science Institute, focusing on implementing basic CRUD operations, user authentication, and detailed management of workshop activities.

## Features

### Employee Management
- **Add/Remove Employees**: Admin users can add new employees or remove existing ones.
- **Employee Calendar**: Display each employee's busy and available time slots.
- **Hourly Rate**: Track the hourly rate of each employee.

### Ticket Management
- **Manage Calendar**: Allow employees to manage their work schedules by adding or removing hourly slots for each day.
- **View Slots**: View available and occupied slots for repairs.
- **Accept Tickets**: Enable employees to accept repair tickets and assign their slots for the given ticket. Update the ticket status from 'created' to 'in progress'.
- **Ticket States**: Change ticket states (created, in progress, done, closed).

### Creating a Ticket
- **Ticket Details**: Create a ticket with details including the car's brand, model, registration ID, and a description of the problem.

### Maintaining a Ticket
- **Repair Estimate**: Add or update repair estimates, including description and expected cost.
- **Client Approval**: Mark whether the client has accepted the estimate.
- **Parts Management**: Track parts used in the repair, including name, amount, unit price, and total price (calculated automatically).
- **Client Payment**: Record the price paid by the client.

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) (version 14 or later)
- [.NET SDK](https://dotnet.microsoft.com/download) (version 8.0 or later)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or SQL Server Express)

### Installation
1. **Clone the Repository:**
    ```bash
    git clone https://github.com/your-github-username/Car-Workshop-React.git
    cd Car-Workshop-React
    ```

2. **Setup the Backend:**
   - Update the `appsettings.json` file with the SQL Server connection string.
   - Run the following command to create and seed the database:
    ```bash
    dotnet ef database update
    ```

3. **Run the Backend:**
    ```bash
    cd CarWorkshop.Server
    dotnet run
    ```
   The backend server will be running on `https://localhost:7228`.

4. **Setup the Frontend:**
    ```bash
    cd CarWorkshop.Client
    npm install
    ```

5. **Run the Frontend:**
    ```bash
    npm start
    ```
   Open a browser and navigate to `http://localhost:5173` to use the application.

### Usage
- **Admin Users**: Use the admin interface to manage employees and view detailed reports.
- **Employee Users**: Employees can log in to manage their schedules, accept tickets, and update ticket information.

### Project Structure
- **Controllers**: Handle API requests and responses.
- **Models**: Define data structures and their relationships.
- **Views**: React components for the user interface.
- **Data**: Database context and migration files.

## Screenshots
---
![login](https://github.com/m-Jakub/Car-Workshop-with-React/assets/133584402/658426d6-97f9-429f-9150-2d3ae35e5b57)

![employee_management](https://github.com/m-Jakub/Car-Workshop-with-React/assets/133584402/15b5543b-7b3c-4c29-9a5e-56f95453001b)

![ticket_management](https://github.com/m-Jakub/Car-Workshop-with-React/assets/133584402/cf60f6ed-38ff-4f95-b733-4c5581e08449)

![creating_ticket](https://github.com/m-Jakub/Car-Workshop-with-React/assets/133584402/a2bda5e7-25ac-489f-803d-4a0d12e44a97)

![calendar](https://github.com/m-Jakub/Car-Workshop-with-React/assets/133584402/99b27617-66f2-4ca2-878a-7fc23bca4537)

![accepting_ticket](https://github.com/m-Jakub/Car-Workshop-with-React/assets/133584402/a93918e5-16c6-428f-8b13-bbc06895d4a0)

![choosing_slots](https://github.com/m-Jakub/Car-Workshop-with-React/assets/133584402/20cbb4a4-c993-4628-bc60-89e1072e7de4)

---
