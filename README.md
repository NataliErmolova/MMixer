# MMixer - Website where social media and and music meet

MMixer is a music-themed web app where users can explore a social feed of posts, search and play YouTube songs, and manage their listening activity. It features user authentication, a dynamic music player, and interactive components like comments and recently played history.

## Requirements

- [Python 3.10 or higher](https://www.python.org/downloads/release/python-3100/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/) (used as the database backend)
- [pgAdmin 4](https://www.pgadmin.org/download/) (optional, for managing the database and running SQL scripts)


## Clone the Project
```bash
git clone https://github.com/NataliErmolova/Mmixer.git
```

## Configure the Project

MMixer uses a PostgreSQL database, so you’ll need to set up a local PostgreSQL instance to run the project completely.
Database configuration can be found in `docker-compose.yaml` under `services → backend → environment`.
Make sure to update these values to match your local PostgreSQL setup:

```bash
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_PORT=your_db_port
```

## Populate the Database

To complete the database setup, open **pgAdmin 4**, launch the Query Tool, and execute the contents of the following files to create the necessary tables and insert the initial data.

[Create Tables, Sequences, and Functions Script](./sql_create_scripts.txt)


## Run the Project

Launch Docker Desktop — you’ll see both applications appear after running the commands below.
Next, open your terminal and navigate to the cloned project directory:

```bash
cd Mmixer
```
To move between folders:

```bash
cd <your-folder-name>
cd ..
```

Use the following commands to navigate to the project directory.
Once you're there, your terminal prompt should display:

```bash
...\Mmixer>
```
or
```bash
~/Mmixer$
```

(depending on your OS and terminal)

run the project using Docker:

```bash
docker-compose up --build
```

This will start the frontend and backend on ports 3000 and 5000.

If you want to change these ports or other settings, edit the [docker-compose.yaml](./docker-compose.yaml) file.

To stop:
```bash
docker-compose down
```
