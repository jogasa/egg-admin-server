'use strict';

const crypto = require('crypto');

module.exports = app => {
  class userService extends app.Service {

    * index(pageNumber = 1, pageSize = 20, query) {

      const result = yield this.app.mysql.get('back').select('back_user', {
        where: query,
        limit: Number(pageSize), // 返回数据量
        offset: (pageNumber - 1) * pageSize, // 数据偏移量
        orders: [[ 'update_date', 'desc' ]], // 排序方式
      });

      const totalCount = yield this.app.mysql.get('back').count('back_user', query);

      return {
        list: result,
        currentPage: Number(pageNumber),
        pages: Math.ceil(result.length / pageSize),
        total: totalCount,
      };
    }

    * create(data) {

      /*eslint-disable */
      const result = yield this.app.mysql.get('back').insert('back_user', Object.assign(data, {
        user_password: crypto.createHash('md5').update(data.user_password).digest('hex')
      }));
      /*eslint-enable */

      return result;
    }

    * destroy(id) {
      const conn = yield app.mysql.get('back').beginTransaction(); // 初始化事务
      try {
        yield this.app.mysql.get('back').delete('back_user', { id });
        yield this.app.mysql.get('back').delete('back_user_role', { user_id: id });

        yield conn.commit(); // 提交事务
      } catch (err) {
        // error, rollback
        yield conn.rollback(); // 一定记得捕获异常后回滚事务！！
        throw err;
      }

    }

    * edit(id) {
      const result = yield this.app.mysql.get('back').get('back_user', {
        id,
      });

      return result;
    }

    * update(id, data) {
      let newData = Object.assign(data, { id });

      if (data.user_password) {
        newData = Object.assign(newData, {
          user_password: crypto.createHash('md5').update(data.user_password).digest('hex'),
        });
      }

      const result = yield this.app.mysql.get('back').update('back_user', newData);

      return result;
    }
  }
  return userService;
};

