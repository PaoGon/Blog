# Blog style web app

A simple twitter like web app, where user can create, update and delete their own post and view other users posts.

## Project prerequisites

General requirements

* npm
* composer

## Quick start

Note: clone this inside your webserver's directory

1.Cloning the repository

```bash
git clone https://github.com/PaoGon/Blog.git
```
2.Installing frontend dependencies

```bash
cd Blog/frontend
npm install
```
3.Installing backend dependencies

```bash
cd ../backend
composer install
```
## Usage

Make sure you installed all of the required dependencies
```bash
cd ../frontend
npm run start
```

## API Reference

#### Get all posts

```http
  GET /api/get_posts
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `JWT token` | `string` | **Required**. Users Authorization token/JWT token |

returns all posts of all the existing users from latest to oldest
JSON data with success(0 or 1), HTTP response code, data(JSON {id, title, content, date created })

#### Get own posts

```http
  GET /api/get_own_posts?user_id=${user_id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :------------------------- |
| `JWT token` | `string` | **Required**. Users Authorization token/JWT token |
| `user_id`      | `int` | **Required**. ID of the user to fetch with |

returns all posts of the user from latest to oldest posts this called when viewing the users timeline
JSON data with success(0 or 1), HTTP response code, data(JSON {id, title, content, date created })

#### Create posts

```http
  POST /api/create_post
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :------------------------- |
| `JWT token` | `string` | **Required**. Users Authorization token/JWT token |
| `user_id`      | `int` | **Required**. ID of the user to fetch with |
| `title` | `string` | **Required**. Title of the post |
| `content` | `string` | **Required**. Content of the post |

returns a JSON data with success, HTTP response code, message(successfull, failed or Method not Allowed)

#### Update posts

```http
  PUT /api/update_post
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :------------------------- |
| `JWT token` | `string` | **Required**. Users Authorization token/JWT token |
| `post_id`      | `int` | **Required**. ID of post to update |
| `user_id`      | `int` | **Required**. ID of the user to query with |
| `title` | `string` | **Required**. Title of the post |
| `content` | `string` | **Required**. Content of the post |

returns a JSON data with success, HTTP response code, message(successfull, failed or Method not Allowed)

#### Delete posts

```http
  DELETE /api/update_post
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :------------------------- |
| `JWT token` | `string` | **Required**. Users Authorization token/JWT token |
| `post_id`      | `int` | **Required**. ID of post to delete |
| `user_id`      | `int` | **Required**. ID of the user to query with |

returns a JSON data with success, HTTP response code, message(successfull, failed or Method not Allowed)


#### Login

```http
  POST /api/accounts/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. Users Email |
| `password` | `string` | **Required**. Users Password |

returns the Authorization bearer key or the JWT token

#### Signup

```http
  POST /api/accounts/signup
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Users username |
| `email` | `string` | **Required**. Users Email |
| `password` | `string` | **Required**. Users Password |

returns a JSON data with success, HTTP response code, message(successfull, failed or Method not Allowed)
