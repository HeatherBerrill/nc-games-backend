const {
  formatCategoriesData,
  formatUsersData,
  formatReviewsData,
  formatCommentsData,
  createReviewRefObj
} = require('../db/utils/data-manipulation.js');

describe('formatUsersData()', () => {
  test('returns an empty array when passed an empty array', () => {
    const input = [];
    expect(formatUsersData(input)).toEqual([]);
  });

  test('returns an array of arrays when passed an array of users objects ', () => {
    const input = [
      {
        username: 'mallionaire',
        name: 'haz',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
      },
      {
        username: 'philippaclaire9',
        name: 'philippa',
        avatar_url:
          'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
      }
    ];
    expect(formatUsersData(input)).toEqual([
      [
        'mallionaire',
        'haz',
        'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
      ],
      [
        'philippaclaire9',
        'philippa',
        'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
      ]
    ]);
  });

  test('format function is new array and does not mutate original array  ', () => {
    const input = [
      {
        username: 'mallionaire',
        name: 'haz',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
      },
      {
        username: 'philippaclaire9',
        name: 'philippa',
        avatar_url:
          'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
      }
    ];

    const output = formatUsersData(input);

    expect(output).not.toBe(input);
    formatUsersData(input);
    expect(input).toEqual([
      {
        username: 'mallionaire',
        name: 'haz',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
      },
      {
        username: 'philippaclaire9',
        name: 'philippa',
        avatar_url:
          'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
      }
    ]);
  });
});

describe('formatCategoriesData()', () => {
  test('returns an empty array when passed an empty array', () => {
    const input = [];
    expect(formatCategoriesData(input)).toEqual([]);
  });

  test('returns an array of arrays when passed an array of categories objects ', () => {
    const input = [
      { slug: 'dexterity', description: 'Games involving physical skill' },
      { slug: "children's games", description: 'Games suitable for children' }
    ];
    expect(formatCategoriesData(input)).toEqual([
      ['dexterity', 'Games involving physical skill'],
      ["children's games", 'Games suitable for children']
    ]);
  });
});

describe('formatReviewsData()', () => {
  test('returns an empty array when passed an empty array', () => {
    const input = [];
    expect(formatReviewsData(input)).toEqual([]);
  });

  test('returns an array of arrays when passed an array of reviews objects ', () => {
    const input = [
      {
        title: 'Agricola',
        designer: 'Uwe Rosenberg',
        owner: 'mallionaire',
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        review_body: 'Farmyard fun!',
        category: 'euro game',
        created_at: new Date(1610964020514),
        votes: 1
      },
      {
        title: 'Jenga',
        designer: 'Leslie Scott',
        owner: 'philippaclaire9',
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        review_body: 'Fiddly fun for all the family',
        category: 'dexterity',
        created_at: new Date(1610964101251),
        votes: 5
      }
    ];
    expect(formatReviewsData(input)).toEqual([
      [
        'Agricola',
        'Uwe Rosenberg',
        'mallionaire',
        'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        'Farmyard fun!',
        'euro game',
        new Date(1610964020514),
        1
      ],
      [
        'Jenga',
        'Leslie Scott',
        'philippaclaire9',
        'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        'Fiddly fun for all the family',
        'dexterity',
        new Date(1610964101251),
        5
      ]
    ]);
  });

  test('format function is new array and does not mutate original array  ', () => {
    const input = [
      {
        title: 'Agricola',
        designer: 'Uwe Rosenberg',
        owner: 'mallionaire',
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        review_body: 'Farmyard fun!',
        category: 'euro game',
        created_at: new Date(1610964020514),
        votes: 1
      },
      {
        title: 'Jenga',
        designer: 'Leslie Scott',
        owner: 'philippaclaire9',
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        review_body: 'Fiddly fun for all the family',
        category: 'dexterity',
        created_at: new Date(1610964101251),
        votes: 5
      }
    ];

    const output = formatReviewsData(input);

    expect(output).not.toBe(input);
    formatReviewsData(input);
    expect(input).toEqual([
      {
        title: 'Agricola',
        designer: 'Uwe Rosenberg',
        owner: 'mallionaire',
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        review_body: 'Farmyard fun!',
        category: 'euro game',
        created_at: new Date(1610964020514),
        votes: 1
      },
      {
        title: 'Jenga',
        designer: 'Leslie Scott',
        owner: 'philippaclaire9',
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        review_body: 'Fiddly fun for all the family',
        category: 'dexterity',
        created_at: new Date(1610964101251),
        votes: 5
      }
    ]);
  });
});

describe('createReviewRefObj', () => {
  test('returns an object', () => {
    const testObj = [{}];
    expect(typeof createReviewRefObj(testObj)).toBe('object');
  });

  test('returns an object with title as key and review_id as value', () => {
    const input = [
      {
        review_id: 1,
        title: 'Agricola',
        designer: 'Uwe Rosenberg',
        owner: 'mallionaire',
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        review_body: 'Farmyard fun!',
        category: 'euro game',
        created_at: new Date(1610964020514),
        votes: 1
      },
      {
        review_id: 2,
        title: 'Jenga',
        designer: 'Leslie Scott',
        owner: 'philippaclaire9',
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        review_body: 'Fiddly fun for all the family',
        category: 'dexterity',
        created_at: new Date(1610964101251),
        votes: 5
      }
    ];
    expect(createReviewRefObj(input)).toEqual({ Agricola: 1, Jenga: 2 });
  });
});

describe('formatCommentsData()', () => {
  test('returns an empty array when passed an empty array', () => {
    const input1 = [];
    const input2 = {};
    expect(formatCommentsData(input1, input2)).toEqual([]);
  });

  test('returns an array of arrays when passed one comment ', () => {
    const input1 = [
      {
        body: 'My dog loved this game too!',
        belongs_to: 'Ultimate Werewolf',
        created_by: 'mallionaire',
        votes: 13,
        created_at: new Date(1610964545410)
      }
    ];
    const input2 = { 'Ultimate Werewolf': 1 };
    expect(formatCommentsData(input1, input2)).toEqual([
      [
        'mallionaire',
        1,
        13,
        new Date(1610964545410),
        'My dog loved this game too!'
      ]
    ]);
  });

  test('returns an array of arrays when passed an array of comments objects ', () => {
    const input1 = [
      {
        body: 'My dog loved this game too!',
        belongs_to: 'Ultimate Werewolf',
        created_by: 'mallionaire',
        votes: 13,
        created_at: new Date(1610964545410)
      },
      {
        body: 'EPIC board game!',
        belongs_to: 'Jenga',
        created_by: 'bainesface',
        votes: 16,
        created_at: new Date(1511354163389)
      }
    ];
    const input2 = { 'Ultimate Werewolf': 1, Jenga: 2 };
    expect(formatCommentsData(input1, input2)).toEqual([
      [
        'mallionaire',
        1,
        13,
        new Date(1610964545410),
        'My dog loved this game too!'
      ],
      ['bainesface', 2, 16, new Date(1511354163389), 'EPIC board game!']
    ]);
  });

  test('format function is new array and does not mutate original array  ', () => {
    const input1 = [
      {
        body: 'My dog loved this game too!',
        belongs_to: 'Ultimate Werewolf',
        created_by: 'mallionaire',
        votes: 13,
        created_at: new Date(1610964545410)
      },
      {
        body: 'EPIC board game!',
        belongs_to: 'Jenga',
        created_by: 'bainesface',
        votes: 16,
        created_at: new Date(1511354163389)
      }
    ];
    const input2 = { 'Ultimate Werewolf': 1, Jenga: 2 };

    const output = formatCommentsData(input1, input2);

    expect(output).not.toBe(input1);
    formatUsersData(input1, input2);
    expect(input1).toEqual([
      {
        body: 'My dog loved this game too!',
        belongs_to: 'Ultimate Werewolf',
        created_by: 'mallionaire',
        votes: 13,
        created_at: new Date(1610964545410)
      },
      {
        body: 'EPIC board game!',
        belongs_to: 'Jenga',
        created_by: 'bainesface',
        votes: 16,
        created_at: new Date(1511354163389)
      }
    ]);
  });
});
