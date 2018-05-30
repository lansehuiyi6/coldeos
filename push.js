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
    console.error('usage: node start.js [http_endpoint] [input_signed_transaction_file_name]')
	process.exit()
}

const http_endpoint = process.argv[2]
const transaction_file_name = process.argv[3]

;(async () => {
	const readPromise = util.promisify(fs.readFile)
    const input_string = await readPromise(transaction_file_name, 'utf8')
    const input_json = JSON.parse(input_string)

    const config = {
        httpEndpoint: http_endpoint,
    }
    const eos = Eos.Testnet(config)
    const result = await eos.pushTransaction(input_json)

    console.log('Success! result...')
    console.log(result)
})();
