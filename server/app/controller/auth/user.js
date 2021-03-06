'use strict';
let _ = require('underscore');


module.exports = app => {
    class authUserController extends app.Controller {
        * index(ctx) {
            const query = ctx.request.query;

            // 获取传参中指定的key，且过滤掉为`空`的条件。
            const where = _.pick(_.pick(query, ...['user_account', 'user_name', 'user_mobile', 'user_email']), (value) => {
                return value !== '' && value !== undefined;
            });

            const result = yield ctx.service.auth.user.index(query.currentPage, query.pageSize, where);


            ctx.body = {
                code: '0',
                msg: 'OK',
                result: Object.assign(result, {
                    list: result.list.map((obj) => {
                        return _.pick(obj, ...['id', 'user_account', 'user_name', 'user_sex', 'user_mobile', 'user_email', 'remark']);
                    }),
                }),
            };
        }

        * create(ctx) {
            const query = ctx.request.body;

            const createRule = {
                user_account: {
                    type: 'string',
                    required: true,
                },
                user_name: {
                    type: 'string',
                    required: true,
                },
                user_mobile: {
                    type: 'string',
                    required: false,
                    allowEmpty: true,
                },
                user_email: {
                    type: 'email',
                    required: false,
                    allowEmpty: true,
                },
                user_password: {
                    type: 'string',
                    required: true,
                },
            };

            try {
                ctx.validate(createRule);
            } catch (err) {

                this.ctx.body = {
                    code: ctx.helper.errorCode.FORMAT,
                    msg: err.message,
                    result: err.errors,
                };

                return;
            }

            const result = yield ctx.service.auth.user.create(_.pick(query, ...Object.keys(createRule)));

            if (result) {
                ctx.body = {
                    code: '0',
                    msg: 'OK',
                    result: {}
                }
            }

        }

        * destroy(ctx) {
            const query = ctx.params;

            yield ctx.service.auth.user.destroy(query.id);

            ctx.body = {
                code: '0',
                msg: 'OK',
                result: {}
            }
        }

        * edit(ctx) {
            const query = ctx.params;

            const result = yield ctx.service.auth.user.edit(query.id);

            if (!result) {
                ctx.body = {
                    code: ctx.helper.errorCode.FOUND,
                    msg: '未找到对应id',
                    result: {}
                };

                ctx.logger.error(`未找到对应id`);

                return false;
            }

            ctx.body = {
                code: '0',
                msg: 'OK',
                result: _.pick(result, ...['id', 'user_account', 'user_name', 'user_sex', 'user_mobile', 'user_email', 'remark'])
            }
        }

        * update(ctx) {
            const id = ctx.params.id;
            const query = ctx.request.body;

            const createRule = {
                user_account: {
                    type: 'string',
                    required: true
                },
                user_name: {
                    type: 'string',
                    required: true
                },
                user_mobile: {
                    type: 'string',
                    required: false,
                    allowEmpty: true
                },
                user_email: {
                    type: 'email',
                    required: false,
                    allowEmpty: true
                }
            };

            try {
                ctx.validate(createRule);
            } catch (err) {

                this.ctx.body = {
                    code: ctx.helper.errorCode.FORMAT,
                    msg: err.message,
                    result: err.errors
                };

                return;
            }

            const result = yield ctx.service.auth.user.update(id, _.pick(query, ...Object.keys(createRule)));

            if (!result.affectedRows) {
                ctx.body = {
                    code: ctx.helper.errorCode.FOUND,
                    msg: '未找到对应id',
                    result: {}
                };

                ctx.logger.error(`未找到对应id`);

                return false;
            }

            ctx.body = {
                code: '0',
                msg: 'OK',
                result: {}
            }
        }

        * setPassword(ctx) {
            const id = ctx.params.id;
            const query = ctx.request.body;

            const createRule = {
                user_password: {
                    type: 'string',
                    required: true,
                },
            };

            try {
                ctx.validate(createRule);
            } catch (err) {

                this.ctx.body = {
                    code: ctx.helper.errorCode.FORMAT,
                    msg: err.message,
                    result: err.errors
                };

                return;
            }

            const result = yield ctx.service.auth.user.update(id, _.pick(query, ...Object.keys(createRule)));

            if (!result.affectedRows) {
                ctx.body = {
                    code: ctx.helper.errorCode.FOUND,
                    msg: '未找到对应id',
                    result: {}
                };

                ctx.logger.error(`未找到对应id`);

                return false;
            }

            ctx.body = {
                code: '0',
                msg: 'OK',
                result: {}
            }
        }
    }
    return authUserController;
};