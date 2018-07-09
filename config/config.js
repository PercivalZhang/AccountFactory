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
    filePath:{
        authenticatorFile       : '../../auth-code.txt',
        totalAirdropListPath    : '../../input_output/airdrop-total-addresses.txt',
        errorAirdropListPath    : '../../input_output/airdrop-error-list.xlsx',
        okAirdropListPath       : '../../input_output/airdrop-ok-list.txt',
        airdropContractPath     : '../../contract/source/airdrop.sol'
    }
};
