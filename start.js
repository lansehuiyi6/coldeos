// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const Eos = require('eosjs')
const fs = require('fs');
const util = require('util');

if (process.argv.length < 4) {
    console.error('usage: node start.js [http_endpoint] [input_raw_transaction_file_name]')
    process.exit()
}

http_endpoint = process.argv[2]
transaction_file_name = process.argv[3]

;(async () => {
    const readPromise = util.promisify(fs.readFile)
    const input_string = await readPromise(transaction_file_name, 'utf8')
    const input_json = JSON.parse(input_string)

    const config = {
        keyProvider: [],
        httpEndpoint: http_endpoint,
        broadcast: false,
        sign: false,
        debug: false,
        expireInSeconds: 1200,  // 20 minutes
    }
    const eos = Eos.Testnet(config)
    const info = await eos.getInfo({})

    const packed_tx = await eos.transaction(input_json, config)

    const output = {
        chain_id: info.chain_id,
        transaction: packed_tx.transaction.transaction,
    }

    console.log(JSON.stringify(output, null, 4))
})();
