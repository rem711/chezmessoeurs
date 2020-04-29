module.exports = {
    apps : [
        {
            name : "crm.cms",
            script : "./index.js",
            instances : 1,
            // exec_mode : "cluster",
            watch : true,
            env : {
                "PORT" : 3000,
                "NODE_ENV" : "production"
            }
        }
    ]
}