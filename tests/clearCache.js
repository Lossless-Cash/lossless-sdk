function deleteChildren(cachedModule) {
    cachedModule.children.forEach(child => {
        if(!child.filename.includes('node_modules')) {
            if( require.cache[child.filename]
                && require.cache[child.filename].children.length > 0
            )
                deleteChildren(require.cache[ child.filename ]);
        }

        if(child.filename != process.cwd() + '/config/addresses.js')
            delete require.cache[ child.filename ]
    });

    if(cachedModule.filename != process.cwd() + '/config/addresses.js')
        delete require.cache[ cachedModule.filename ]
}

module.exports = function() {
    if(require.cache[ process.cwd() + '/src/index.js' ]) {
        deleteChildren(require.cache[ process.cwd() + '/src/index.js' ]);
    }
    if(require.cache[ process.cwd() + '/lossless.config.js' ]) {
        deleteChildren(require.cache[ process.cwd() + '/lossless.config.js' ]);
    }

    delete require.cache[ process.cwd() + '/config/index.js' ];
    delete require.cache[ process.cwd() + '/src/index.js' ];
    delete require.cache[ process.cwd() + '/src/setupProvider.js' ];
    delete require.cache[ process.cwd() + '/src/setupWallet.js' ];
    delete require.cache[ process.cwd() + '/src/contractCall.js' ];
}
