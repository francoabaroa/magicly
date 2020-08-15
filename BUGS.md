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