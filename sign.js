// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const Eos = require('eosjs')
const Fcbuffer = require('fcbuffer')
const fs = require('fs')
const util = require('util')
const ecc = require('eosjs-ecc')
const readline = require('readline')

if (process.argv.length < 4) {
	console.error('usage: node sign.js [input_unsigned_transaction_file_name] [output_signed_transaction_file_name]')
	process.exit()
}
input_file = process.argv[2]
output_file = process.argv[3]

// This function is not related to eos. It just gets your private key without printing
// to the screen.
//
// NOTE: Is any trace left on the system after this? I'm not sure.
//
// See: https://stackoverflow.com/a/48561893/9472372
const hiddenQuestion = query => new Promise((resolve, reject) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const stdin = process.openStdin();
  process.stdin.on('data', char => {
    char = char + '';
    switch (char) {
      case '\n':
      case '\r':
      case '\u0004':
        stdin.pause()
        break;
      default:
        process.stdout.clearLine()
        readline.cursorTo(process.stdout, 0)
        process.stdout.write(query + Array(rl.line.length + 1).join('*'))
        break;
    }
  });
  rl.question(query, value => {
    rl.history = rl.history.slice(1);
    resolve(value);
  });
});


;(async () => {
	const readPromise = util.promisify(fs.readFile)
    const input_string = await readPromise(input_file, 'utf8')
    const input_json = JSON.parse(input_string)

    const chain_id = input_json.chain_id
    const transaction = input_json.transaction

    console.log('enter your password:')
    const pvt = await hiddenQuestion('> ')

    const eos = Eos.Localnet({})
    const Transaction = eos.fc.structs.transaction

	  const buf = Fcbuffer.toBuffer(Transaction, transaction)
	  const chain_id_buf = new Buffer(chain_id, 'hex')
	  const sign_buf = Buffer.concat([chain_id_buf, buf, new Buffer(new Uint8Array(32))])
	  const sig = ecc.sign(sign_buf, pvt)

    const output = {
    	compression: 'none',
    	transaction: transaction,
    	signatures: [sig],
    }

    const writePromise = util.promisify(fs.writeFile)
    await writePromise(output_file, JSON.stringify(output, null, 4))
    console.log("Output written to: " + output_file);
 })();