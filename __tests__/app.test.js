const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const toBeSortedBy = require('jest-sorted');
const request = require('supertest');
const app = require('../app.js');
const {
  categoryData,
  commentData,
  reviewData,
  userData
} = require('../db/data/test-data/index.js');

beforeEach(() => {
  return seed({ categoryData, commentData, reviewData, userData });
});

afterAll(() => {
  return db.end();
});
describe('app', () => {
  test('GET- ERROR- when given an incorrect path, returns a custom 404 error message', () => {
    return request(app)
      .get('/api/cats')
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe(
          "Sorry the path you've chosen does not exist"
        );
      });
  });

  describe('./api', () => {
    test('GET- returns json file of all endpoints', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
          expect(typeof response.body).toEqual('object');
        });
    });
  });

  describe('./api/categories', () => {
    test('GET- status 200 - returns an array of categories', () => {
      return request(app)
        .get('/api/categories')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.categories)).toBe(true);
          expect(response.body.categories.length).toBeGreaterThan(0);
          response.body.categories.forEach((category) => {
            expect(category).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String)
            });
          });
        });
    });

    test('GET- when returned, categories array is in alphabetical order', () => {
      return request(app)
        .get('/api/categories')
        .then((response) => {
          expect(response.body.categories).toBeSorted('slug');
        });
    });

    test('GET- accepts a query to limit number of results', () => {
      return request(app)
        .get('/api/categories?limit=4')
        .then((response) => {
          expect(response.body.categories).toHaveLength(4);
        });
    });

    test('GET- accepts a query to choose page of results', () => {
      return request(app)
        .get('/api/categories?p=2&limit=2')
        .then((response) => {
          expect(response.body.categories).toEqual([
            {
              slug: 'dexterity',
              description: 'Games involving physical skill'
            },
            {
              slug: 'engine-building',
              description:
                'Games where players construct unique points-gaining engines main element of the gameplay'
            }
          ]);
        });
    });

    test('POST- adds a new category, responds with new category', () => {
      return request(app)
        .post('/api/categories')
        .send({
          slug: 'horror',
          description: 'things that go bump in the night'
        })
        .expect(201)
        .then((response) => {
          expect(typeof response.body).toBe('object');
          expect(response.body.slug).toBe('horror');
          expect(response.body.description).toBe(
            'things that go bump in the night'
          );
        });
    });
  });

  describe('./api/reviews', () => {
    test('GET- status 200 - returns an array of reviews', () => {
      return request(app)
        .get('/api/reviews')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.reviews)).toBe(true);
          expect(response.body.reviews.length).toBeGreaterThan(0);
          response.body.reviews.forEach((review) => {
            expect(review).toMatchObject({
              review_id: expect.any(Number),
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String)
            });
          });
        });
    });

    test('GET- results sorted in DESC date order by default', () => {
      return request(app)
        .get('/api/reviews')
        .then((response) => {
          expect(response.body.reviews).toBeSortedBy('created_at', {
            descending: true
          });
        });
    });

    test('GET- accepts a query to sort by comments', () => {
      return request(app)
        .get('/api/reviews?sortBy=comment_count')
        .then((response) => {
          expect(response.body.reviews).toBeSortedBy('comment_count', {
            descending: true
          });
        });
    });
    test('GET- accepts a query to sort by title', () => {
      return request(app)
        .get('/api/reviews?sortBy=title')
        .then((response) => {
          expect(response.body.reviews).toBeSortedBy('title', {
            descending: true
          });
        });
    });

    test('GET- accepts a query to sort by votes', () => {
      return request(app)
        .get('/api/reviews?sortBy=votes')
        .then((response) => {
          expect(response.body.reviews).toBeSortedBy('votes', {
            descending: true
          });
        });
    });

    test('GET- accepts a query to choose page of results', () => {
      return request(app)
        .get('/api/reviews?p=2&limit=2')
        .then((response) => {
          expect(response.body.reviews.length).toEqual(2);
          expect(response.body.reviews[0].review_id).toBe(12);
        });
    });

    test('GET- accepts a query to limit results', () => {
      return request(app)
        .get('/api/reviews?limit=3')
        .then((response) => {
          expect(response.body.reviews).toHaveLength(3);
        });
    });
    test('GET- accepts a query to sort in ascending order', () => {
      return request(app)
        .get('/api/reviews?sortOrder=ASC')
        .then((response) => {
          expect(response.body.reviews).toBeSortedBy('created_at');
        });
    });
    test('GET- accepts a query to filter categories', () => {
      return request(app)
        .get('/api/reviews?category=social deduction')
        .then((response) => {
          response.body.reviews.forEach((review) => {
            expect(review.category).toBe('social deduction');
          });
        });
    });

    test('GET- returns an empty array when no reviews found for valid category', () => {
      return request(app)
        .get('/api/reviews?category=deck-building')
        .expect(200)
        .then((response) => {
          expect(typeof response.body).toBe('object');
          expect(response.body.reviews.length).toBe(0);
        });
    });

    test('POST- adds a new review, responds with new review', () => {
      return request(app)
        .post('/api/reviews')
        .send({
          owner: 'dav3rid',
          review_img_url:
            'https://images.pexels.com/photos/2695392/pexels-photo-2695392.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
          title: 'chess',
          review_body: 'its well boring',
          designer: 'nerd',
          category: 'dexterity'
        })
        .expect(201)
        .then((response) => {
          expect(typeof response.body).toBe('object');
          expect(response.body.comment_count).toBe(0);
          expect(response.body.votes).toBe(0);
          expect(response.body.review_id).toBe(14);
        });
    });

    test('GET- ERROR- rejects a query to sort by a non valid column', () => {
      return request(app)
        .get('/api/reviews?sortBy=chairs')
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('cannot sort that way, sorry!');
        });
    });

    test('GET- ERROR- rejects a query to order in an non valid way', () => {
      return request(app)
        .get('/api/reviews?sortOrder=inside_out')
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('cannot order that way, sorry!');
        });
    });

    test('GET- ERROR- rejects a query to filter a non valid category', () => {
      return request(app)
        .get('/api/reviews?category=marzipan_sprinkles')
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe('this is not a valid category');
        });
    });
  });

  describe('./api/reviews/:review_id', () => {
    test('GET- returns review with specified id', () => {
      return request(app)
        .get('/api/reviews/2')
        .expect(200)
        .then((response) => {
          expect(typeof response.body.review).toBe('object');
          expect(response.body.review).toMatchObject({
            review_id: expect.any(Number),
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            review_body: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number)
          });
        });
    });

    test('PATCH- updates votes on review with specified id, responds with updated review', () => {
      return request(app)
        .patch('/api/reviews/1')
        .send({ inc_votes: 10 })
        .expect(200)
        .then((response) => {
          expect(typeof response.body[0]).toBe('object');
          expect(response.body[0].votes).toBe(11);
        });
    });

    test('DELETE- deletes review with specified id, responds with 204 and no content', () => {
      return request(app)
        .delete('/api/reviews/3')
        .expect(204)
        .then(() => {
          return db
            .query('SELECT * FROM reviews WHERE review_id = 3')
            .then((result) => {
              expect(result.rows).toHaveLength(0);
            });
        })
        .then(() => {
          return db
            .query('SELECT * FROM comments WHERE review_id = 3')
            .then((result) => {
              expect(result.rows).toHaveLength(0);
            });
        });
    });

    test('PATCH- ERROR when missing required fields, returns a custom 400 error message', () => {
      return request(app)
        .patch('/api/reviews/3')
        .send({})
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('You are missing required fields');
        });
    });

    test('PATCH- ERROR when required fields are invalid, returns a custom 400 error message', () => {
      return request(app)
        .patch('/api/reviews/3')
        .send({ inc_votes: 'tramp' })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('Sorry that is not a valid input');
        });
    });

    test('PATCH ERROR- when given an invalid id, returns a custom 400 error message', () => {
      return request(app)
        .patch('/api/reviews/not-an-id')
        .send({ inc_votes: 1 })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('Sorry that is not a valid id');
        });
    });

    test('GET- ERROR- when given an incorrect id, returns a custom 404 error message', () => {
      return request(app)
        .get('/api/reviews/999')
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe('Sorry that review does not exist');
        });
    });

    test('GET- ERROR- when given an invalid id, returns a custom 400 error message', () => {
      return request(app)
        .get('/api/reviews/not-an-id')
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('Sorry that is not a valid id');
        });
    });
  });

  describe('./api/reviews/:review_id/comments', () => {
    test('GET- returns comments for review with specified id', () => {
      return request(app)
        .get('/api/reviews/2/comments')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
          expect(response.body[0]).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String)
          });
        });
    });

    test('GET- accepts a query to limit results', () => {
      return request(app)
        .get('/api/reviews/2/comments?limit=2')
        .then((response) => {
          expect(response.body).toHaveLength(2);
        });
    });

    test('GET- accepts a query to choose page of results', () => {
      return request(app)
        .get('/api/reviews/2/comments?p=2&limit=2')
        .then((response) => {
          expect(response.body).toHaveLength(1);
          expect(response.body[0].votes).toBe(13);
          expect(response.body[0].author).toBe('mallionaire');
        });
    });

    test('GET- returns an empty array when no comments were found for specified review', () => {
      return request(app)
        .get('/api/reviews/1/comments')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBe(0);
        });
    });

    test('GET- ERROR- when given an invalid id, returns a custom 400 error message', () => {
      return request(app)
        .get('/api/reviews/not-an-id/comments')
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('Sorry that is not a valid id');
        });
    });

    test('GET- ERROR- when given an incorrect id, returns a custom 404 error message', () => {
      return request(app)
        .get('/api/reviews/999/comments')
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe('Sorry that review does not exist');
        });
    });

    test('POST- adds a comment to the review with specified id, responds with new comment', () => {
      return request(app)
        .post('/api/reviews/1/comments')
        .send({
          username: 'dav3rid',
          body: 'this review is offensive to hedgehogs'
        })
        .expect(201)
        .then((response) => {
          expect(typeof response.body).toBe('object');
          expect(response.body.author).toBe('dav3rid');
          expect(response.body.votes).toBe(0);
          expect(response.body.review_id).toBe(1);
        });
    });

    test('POST- ERROR- when given an invalid id, returns a custom 400 error message', () => {
      return request(app)
        .post('/api/reviews/not-an-id/comments')
        .send({
          username: 'dav3rid',
          body: 'this review is offensive to hedgehogs'
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('Sorry that is not a valid id');
        });
    });

    test('POST- when given extra properties, post ignores them', () => {
      return request(app)
        .post('/api/reviews/3/comments')
        .send({
          username: 'dav3rid',
          body: 'this review is offensive to hedgehogs',
          favourite_chairs: 'red ones',
          chicken_dinner: 'yes'
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toMatchObject({
            comment_id: expect.any(Number),
            author: expect.any(String),
            review_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            body: expect.any(String)
          });
        });
    });

    test('POST- ERROR- when given an incorrect id, returns a custom 404 error message', () => {
      return request(app)
        .post('/api/reviews/999/comments')
        .send({
          username: 'dav3rid',
          body: 'this review is offensive to hedgehogs'
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe('Sorry that review does not exist');
        });
    });

    test('POST- ERROR- when missing required fields, returns a custom 400 error message', () => {
      return request(app)
        .post('/api/reviews/3/comments')
        .send({
          body: 'this review is offensive to hedgehogs'
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('You are missing required fields');
        });
    });
  });

  describe('./api/comments/:comment_id', () => {
    test('DELETE- deletes comment with specified id, responds with 204 and no content', () => {
      return request(app)
        .delete('/api/comments/3')
        .expect(204)
        .then(() => {
          return db.query('SELECT * FROM comments').then((result) => {
            expect(result.rows).toHaveLength(5);
          });
        });
    });

    test('PATCH- increases votes on comment with positive inc_votes, responds with updated comment', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 10 })
        .expect(200)
        .then((response) => {
          expect(typeof response.body[0]).toBe('object');
          expect(response.body[0].votes).toBe(26);
        });
    });

    test('PATCH- decreases votes on comment with negative inc_votes, responds with updated comment', () => {
      return request(app)
        .patch('/api/comments/2')
        .send({ inc_votes: -10 })
        .expect(200)
        .then((response) => {
          expect(typeof response.body[0]).toBe('object');
          expect(response.body[0].votes).toBe(3);
        });
    });

    test('PATCH- ERROR- will reject the promise if the comment_id does not exist', () => {
      return request(app)
        .patch('/api/comments/99')
        .send({ inc_votes: -10 })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe('Sorry that comment does not exist');
        });
    });

    test('PATCH- ERROR- when given an invalid id, returns a custom 400 error message', () => {
      return request(app)
        .patch('/api/comments/squirrel')
        .send({ inc_votes: -10 })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('Sorry that is not a valid id');
        });
    });
  });

  describe('./api/comments', () => {
    test('GET- status 200 - returns an array of comments', () => {
      return request(app)
        .get('/api/comments')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.comments)).toBe(true);
          expect(response.body.comments.length).toBeGreaterThan(0);
          response.body.comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              author: expect.any(String),
              review_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              body: expect.any(String)
            });
          });
        });
    });

    test('GET- when returned, comments array is in date order, most recent first', () => {
      return request(app)
        .get('/api/comments')
        .then((response) => {
          expect(response.body.comments).toBeSortedBy('created_at', {
            descending: true
          });
        });
    });

    test('GET- accepts a query to limit number of results', () => {
      return request(app)
        .get('/api/comments?limit=3')
        .then((response) => {
          expect(response.body.comments).toHaveLength(3);
        });
    });

    test('GET- accepts a query to choose page of results', () => {
      return request(app)
        .get('/api/comments?p=2&limit=2')
        .then((response) => {
          expect(response.body.comments.length).toEqual(2);
          expect(response.body.comments[0].author).toBe('philippaclaire9');
          expect(response.body.comments[1].author).toBe('mallionaire');
        });
    });
  });

  describe('./api/users', () => {
    test('GET- status 200 - returns an array of users', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.users)).toBe(true);
          expect(response.body.users.length).toBeGreaterThan(0);
          response.body.users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String)
            });
          });
        });
    });

    test('GET- when returned, users array is in alphabetical order', () => {
      return request(app)
        .get('/api/users')
        .then((response) => {
          expect(response.body.users).toBeSortedBy('username');
        });
    });

    test('GET- accepts a query to limit number of results', () => {
      return request(app)
        .get('/api/users?limit=2')
        .then((response) => {
          expect(response.body.users).toHaveLength(2);
        });
    });

    test('GET- accepts a query to choose page of results', () => {
      return request(app)
        .get('/api/users?p=2&limit=2')
        .then((response) => {
          expect(response.body.users.length).toEqual(2);
          expect(response.body.users[0].username).toBe('mallionaire');
          expect(response.body.users[1].username).toBe('philippaclaire9');
        });
    });
  });

  describe('./api/users/:username', () => {
    test('GET- returns user with specified username', () => {
      return request(app)
        .get('/api/users/philippaclaire9')
        .expect(200)
        .then((response) => {
          expect(typeof response.body.user).toBe('object');
          expect(response.body.user).toEqual({
            username: 'philippaclaire9',
            name: 'philippa',
            avatar_url:
              'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
          });
        });
    });

    test('GET- ERROR- when given an incorrect username, returns a custom 404 error message', () => {
      return request(app)
        .get('/api/users/999')
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe('Sorry that user does not exist');
        });
    });
  });
});
