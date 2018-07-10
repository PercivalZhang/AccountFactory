/**
 * Created by mingqi
 */
//以太坊网络
module.exports = {
    network: {
        private: {
            providerUrl: 'http://localhost:8545'
        },
        main: {
            providerUrl: 'https://mainnet.infura.io/Womru8vdL6dn75y95U3i',
        },
    },
    database: {
        mysql: {
            host: "rm-rj98z8m7d57q9sg61bo.mysql.rds.aliyuncs.com",
            dialect: "mysql",
            database: "eth_address",
            username: "address_user",
            password: "address_user2018",
            poolConfig: {
                max: 200,
                min: 20,
                idle: 10000
            }
        }
    },
    cryptPublicKey: 'a08cb3ea8b5580676af5b8d248b05db56e206e847ca294f63ce4da28816f1910471767608a0d2feecba769f7acc0cdce34e0b04039876a1687f817bea1027914',
    filePath:{
        authenticatorFile       : '../../auth-code.txt',
        totalAirdropListPath    : '../../input_output/airdrop-total-addresses.txt',
        errorAirdropListPath    : '../../input_output/airdrop-error-list.xlsx',
        okAirdropListPath       : '../../input_output/airdrop-ok-list.txt',
        airdropContractPath     : '../../contract/source/airdrop.sol'
    }
};
