# magicly todo

*general*
1. delete clientOld and serverOld (make sure to see which functionality from serverOld could be used)
2. Add ESLint & Prettier
3. Add Jest + React Testing Library + Cypress
4. Make sure server + client test coverage adequate
5. Storybook implementation?
6. Make sure we have logging tools in place (Sentry)
7. Performance tools
8. Continuous integration + continous deployment GitHub Heroku
9. Add Master (Main), Development, Test, Release branches
10. Decide on best way to do Releases from Test -> Dev -> Master and what tool to use?
11. ADD DOCUMENTATION FOR EVERYTHING UP UNTIL THIS MOMENT -> setting app from scratch, how to deploy, etc
12. Rename master branch to main across everything
13. Set up VS Code with (https://medium.com/productivity-freak/the-ultimate-vscode-setup-for-js-react-6a4f7bd51a2) & (https://gist.github.com/adamwathan/52a96a7ddc538eb73a2680c546861e95)
14. NextJS and Apollo and Typescript tutorial
15. Go through all package.jsons and see which dependencies / dev dependencies are not being used and need to be added
16. Exercises under https://www.robinwieruch.de/graphql-apollo-server-tutorial#apollo-server-setup-with-express
17. Alphabetize all imports, variables, state and props, etc. Start establishing coding best practices
18. Convert JS to Typescript, right now it seems like i'm only using JS
19. Add PHONE NUMBER VALIDATION FROM TWILIO (https://www.twilio.com/blog/2016/06/how-to-validate-phone-numbers-in-nodejavascript-with-the-twilio-lookup-api.html)
20. Add reset password email functionality
21. Search for TODO's in all codebase to find additional ones
22. UPDATE POSTGRES/SEQUELIZE CODE TO WORK WITH HEROKU DEPLOYMENT

*client*
1. disable or enable SSR?
2. Warning: No build cache found. Please configure build caching for faster rebuilds. Read more: https://err.sh/next.js/no-cache
3. Add React Components with Typescript support
4. Add tailwind CSS
5. Hooks in depth
6.

*graphql*
1. Connect to postgres for query + mutation support
2. Add appropriate mutations, queries, subscriptions?
3. see database TODOs below
4. add support for ListItem!!!
5. seperate enums into seperate files (like schema and resolvers)
6. make sure name changes from SEQUELIZE REFLECT GRAPHQL SCHEMAS
7. connect RESOLVERS for remaining schemas
8. make sure null/not null is updated correctly for GRAPHQL schemas as well as Names

*server*
1. Add Postgres + Sequalize?
2. Client -> Server -> postgres call -> return to client
3. Add Auth0 or PassportJS integration for Auth
4. Implement Sign Up and Sign In with JWT?
5. How many salt rounds? Where is the salt stored? (https://stackoverflow.com/questions/1219899/where-do-you-store-your-salt-strings)
6. turn on "noImplicitAny": true,

*database*
1. Check which fields are required in the schemas and which aren't? which are nullable? update this and update GraphQL
2. Change some of the names (like status and hash) to be more descriptive
3. Change language in SQL schema to be an ENUM and also change in GraphQL
4. On storing currentCity, make sure to store lowercase? doesnt matter?

*link resources*
1. https://gregberge.com/blog/javascript-stack-2020\
2. https://product.voxmedia.com/2020/3/17/21172182/how-we-rewrote-a-vue-app-with-react-and-tailwind-in-21-days
3. https://www.executeprogram.com/
4.


