There are several mystery BUGS/ERRORS:


1)

2020-08-15T22:04:50.690175+00:00 app[web.1]: TypeError: Cannot read property 'kind' of undefined
2020-08-15T22:04:50.690189+00:00 app[web.1]: at getErrorSpanForNode (/app/node_modules/typescript/lib/typescript.js:13859:22)
2020-08-15T22:04:50.690213+00:00 app[web.1]: at createDiagnosticForNodeInSourceFile (/app/node_modules/typescript/lib/typescript.js:13808:20)
2020-08-15T22:04:50.690213+00:00 app[web.1]: at Object.createDiagnosticForNode (/app/node_modules/typescript/lib/typescript.js:13799:16)
2020-08-15T22:04:50.690214+00:00 app[web.1]: at /app/node_modules/typescript/lib/typescript.js:41841:135
2020-08-15T22:04:50.690215+00:00 app[web.1]: at Map.forEach (<anonymous>)
2020-08-15T22:04:50.690215+00:00 app[web.1]: at getInitializerTypeFromAssignmentDeclaration (/app/node_modules/typescript/lib/typescript.js:41823:52)
2020-08-15T22:04:50.690216+00:00 app[web.1]: at getWidenedTypeForAssignmentDeclaration (/app/node_modules/typescript/lib/typescript.js:41717:123)
2020-08-15T22:04:50.690216+00:00 app[web.1]: at getTypeOfFuncClassEnumModuleWorker (/app/node_modules/typescript/lib/typescript.js:42277:34)
2020-08-15T22:04:50.690216+00:00 app[web.1]: at getTypeOfFuncClassEnumModule (/app/node_modules/typescript/lib/typescript.js:42256:51)
2020-08-15T22:04:50.690217+00:00 app[web.1]: at getTypeOfSymbol (/app/node_modules/typescript/lib/typescript.js:42369:24)
2020-08-15T22:04:50.690217+00:00 app[web.1]: at checkPropertyAccessExpressionOrQualifiedName (/app/node_modules/typescript/lib/typescript.js:57184:53)
2020-08-15T22:04:50.690218+00:00 app[web.1]: at checkPropertyAccessExpression (/app/node_modules/typescript/lib/typescript.js:57043:17)
2020-08-15T22:04:50.690218+00:00 app[web.1]: at checkExpressionWorker (/app/node_modules/typescript/lib/typescript.js:61676:28)
2020-08-15T22:04:50.690219+00:00 app[web.1]: at checkExpression (/app/node_modules/typescript/lib/typescript.js:61597:38)
2020-08-15T22:04:50.690219+00:00 app[web.1]: at maybeCheckExpression (/app/node_modules/typescript/lib/typescript.js:60810:34)
2020-08-15T22:04:50.690220+00:00 app[web.1]: at checkBinaryExpression (/app/node_modules/typescript/lib/typescript.js:60767:25)
2020-08-15T22:04:50.690220+00:00 app[web.1]: at checkExpressionWorker (/app/node_modules/typescript/lib/typescript.js:61717:28)
2020-08-15T22:04:50.690220+00:00 app[web.1]: at checkExpression (/app/node_modules/typescript/lib/typescript.js:61597:38)
2020-08-15T22:04:50.690221+00:00 app[web.1]: at checkExpressionStatement (/app/node_modules/typescript/lib/typescript.js:64066:13)
2020-08-15T22:04:50.690221+00:00 app[web.1]: at checkSourceElementWorker (/app/node_modules/typescript/lib/typescript.js:66594:28)
2020-08-15T22:04:50.690221+00:00 app[web.1]: at checkSourceElement (/app/node_modules/typescript/lib/typescript.js:66472:17)
2020-08-15T22:04:50.690222+00:00 app[web.1]: at Object.forEach (/app/node_modules/typescript/lib/typescript.js:317:30)
2020-08-15T22:04:52.743990+00:00 heroku[router]: at=info method=GET path="/pricing" host=magiclyapp.herokuapp.com request_id=f702d943-2c4a-4d32-8792-bb4a7bae39c7 fwd="76.108.199.96" dyno=web.1 connect=0ms service=3225ms status=500 bytes=1316 protocol=https

---------------------------------------------------------------------------
---------------------------------------------------------------------------

2)

Uncaught (in promise) Error: GraphQL error: No user found with these login credentials.

UNHANDLED in GRAPHQL SIDE: No user found with these login credentials

error.message.includes('No user found with these login credentials')

---------------------------------------------------------------------------
---------------------------------------------------------------------------

3) Warning: Prop `className` did not match. Server: "MuiButtonBase-root MuiIconButton-root makeStyles-menuButton-87 MuiIconButton-colorInherit MuiIconButton-edgeStart" Client: "MuiButtonBase-root MuiIconButton-root makeStyles-menuButton-3 MuiIconButton-colorInherit MuiIconButton-edgeStart"

---------------------------------------------------------------------------
---------------------------------------------------------------------------

4) TypeError: Cannot read property 'type' of undefined
    at reducer (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/@next/react-dev-overlay/src/internal/ReactDevOverlay.tsx:18:14)
    at Object.useReducer (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/react-dom/cjs/react-dom-server.node.development.js:1170:22)
    at Object.useReducer (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/react/cjs/react.development.js:1501:21)
    at ReactDevOverlay (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/@next/react-dev-overlay/src/internal/ReactDevOverlay.tsx:45:9)
    at finishHooks (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/react-dom/cjs/react-dom-server.node.development.js:1075:16)
    at processChild (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/react-dom/cjs/react-dom-server.node.development.js:3044:14)
    at resolve (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/react-dom/cjs/react-dom-server.node.development.js:2960:5)
    at ReactDOMServerRenderer.render (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/react-dom/cjs/react-dom-server.node.development.js:3435:22)
    at ReactDOMServerRenderer.read (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/react-dom/cjs/react-dom-server.node.development.js:3373:29)
    at renderToString (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/react-dom/cjs/react-dom-server.node.development.js:3988:27)
    at renderPage (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/next/next-server/server/render.tsx:696:22)
    at Object.ctx.renderPage (webpack-internal:///./pages/_document.js:113:26)
    at Function.getInitialProps (webpack-internal:///../../node_modules/next/dist/pages/_document.js:129:19)
    at Function.getInitialProps (webpack-internal:///./pages/_document.js:124:83)
    at loadGetInitialProps (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/next/next-server/lib/utils.ts:323:27)
    at renderToHTML (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/next/next-server/server/render.tsx:719:48)
    at /Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/next/next-server/server/next-server.ts:1094:26
    at /Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/next/next-server/server/next-server.ts:1059:25
    at DevServer.renderToHTMLWithComponents (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/next/next-server/server/next-server.ts:1179:9)
    at DevServer.renderErrorToHTML (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/next/next-server/server/next-server.ts:1338:16)
    at DevServer.renderErrorToHTML (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/next/server/next-dev-server.ts:580:19)
    at DevServer.renderToHTML (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/next/next-server/server/next-server.ts:1270:14)

---------------------------------------------------------------------------
---------------------------------------------------------------------------

5) Error while running `getDataFromTree` ApolloError: Network error: Response not successful: Received status code 400
    at new ApolloError (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/apollo-client/bundle.umd.js:92:26)
    at /Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/apollo-client/bundle.umd.js:1588:34
    at /Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/apollo-client/bundle.umd.js:2008:15
    at Set.forEach (<anonymous>)
    at /Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/apollo-client/bundle.umd.js:2006:26
    at Map.forEach (<anonymous>)
    at QueryManager.broadcastQueries (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/apollo-client/bundle.umd.js:2004:20)
    at /Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/apollo-client/bundle.umd.js:1483:29
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:97:5) {
  graphQLErrors: [],
  networkError: Error [ServerError]: Response not successful: Received status code 400
      at Object.exports.throwServerError (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/apollo-link-http-common/src/index.ts:114:17)
      at /Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/apollo-link-http-common/src/index.ts:145:11
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:97:5) {
    name: 'ServerError',
    response: Response {
      size: 0,
      timeout: 0,
      [Symbol(Body internals)]: [Object],
      [Symbol(Response internals)]: [Object]
    },
    statusCode: 400,
    result: { errors: [Array] }
  },
  message: 'Network error: Response not successful: Received status code 400',
  extraInfo: undefined
}

---------------------------------------------------------------------------
---------------------------------------------------------------------------

6) (node:61530) UnhandledPromiseRejectionWarning: TypeError: Cannot set property 'status' of undefined
    at /Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/next/server/hot-reloader.ts:329:13
    at async Promise.all (index 0)
    at DynamicEntryPlugin.config.entry (/Users/francoabaroa/Desktop/Hack_Reactor/Repos/career/magicly/magicly/node_modules/next/server/hot-reloader.ts:312:9)
(node:61530) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.

---------------------------------------------------------------------------
---------------------------------------------------------------------------

7)

---------------------------------------------------------------------------
---------------------------------------------------------------------------

