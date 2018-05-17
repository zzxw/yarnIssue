import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const home = resolve => {
    require.ensure(['../vue/home.vue'], () => {
        resolve(require('../vue/home.vue'));
    });
};

const issueMail = resolve => {
    require.ensure(['../vue/issue-mail.vue'], () => {
        resolve(require('../vue/issue-mail.vue'));
    });
};

const issueCategory = resolve => {
    require.ensure(['../vue/issue-category.vue'], () => {
        resolve(require('../vue/issue-category.vue'));
    });
};
const issueTrace = resolve => {
    require.ensure(['../vue/issue-trace.vue'], () => {
        resolve(require('../vue/issue-trace.vue'));
    });
};
const countTrend = resolve => {
    require.ensure(['../vue/count-trend.vue'], () => {
        resolve(require('../vue/count-trend.vue'));
    });
};
const countProjects = resolve => {
    require.ensure(['../vue/count-projects.vue'], () => {
        resolve(require('../vue/count-projects.vue'));
    });
};
const countTypes = resolve => {
    require.ensure(['../vue/count-types.vue'], () => {
        resolve(require('../vue/count-types.vue'));
    });
};
const issueVersion = resolve => {
    require.ensure(['../vue/issue-version.vue'], () => {
        resolve(require('../vue/issue-version.vue'));
    });
};
const about = resolve => {
    require.ensure(['../vue/about.vue'], () => {
        resolve(require('../vue/about.vue'));
    });
};
const helpSearch = resolve => {
    require.ensure(['../vue/help-search.vue'], () => {
        resolve(require('../vue/help-search.vue'));
    });
};

const routes = [{
        path: '/',
        name: 'home',
        component: home
    },{
        path: '/issue/mail',
        name: 'issueMail',
        component: issueMail
    },{
        path: '/issue/category',
        name: 'issueCategory',
        component: issueCategory
    },{
        path: '/issue/trace',
        name: 'issueTrace',
        component: issueTrace
    },{
        path: '/count/trend',
        name: 'countTrend',
        component: countTrend
    },{
        path: '/count/projects',
        name: 'countProjects',
        component: countProjects
    },{
        path: '/count/types',
        name: 'countTypes',
        component: countTypes
    },{
        path: '/issue/version',
        name: 'issueVersion',
        component: issueVersion
    },{
        path: '/help/about',
        name: 'about',
        component: about
    },{
        path: '/help/search',
        name: 'helpSearch',
        component: helpSearch
    },{
        path: '*',
        component: home
    }];

export default new Router({
    mode: 'history',
    base: __dirname,
    routes
});