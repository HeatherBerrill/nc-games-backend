function formatUsersData(usersData) {
  if (usersData.length === 0) return [];
  else {
    return usersData.map((object) => {
      return [object.username, object.name, object.avatar_url];
    });
  }
}

function formatCategoriesData(categoriesData) {
  if (categoriesData.length === 0) return [];
  else {
    return categoriesData.map((object) => {
      return [object.slug, object.description];
    });
  }
}

function formatReviewsData(reviewsData) {
  if (reviewsData.length === 0) return [];
  else {
    return reviewsData.map((object) => {
      return [
        object.title,
        object.designer,
        object.owner,
        object.review_img_url,
        object.review_body,
        object.category,
        object.created_at,
        object.votes
      ];
    });
  }
}

function formatCommentsData(commentsData, refObj) {
  if (commentsData.length === 0) return [];
  else {
    const newCommentsData = commentsData.map((comment) => {
      return [
        comment.created_by,
        refObj[comment.belongs_to],
        comment.votes,
        comment.created_at,
        comment.body
      ];
    });

    return newCommentsData;
  }
}

function createReviewRefObj(reviewsData) {
  const refObj = {};

  reviewsData.forEach((review) => {
    refObj[review['title']] = review['review_id'];
  });

  return refObj;
}

module.exports = {
  formatCategoriesData,
  formatUsersData,
  formatReviewsData,
  formatCommentsData,
  createReviewRefObj
};
