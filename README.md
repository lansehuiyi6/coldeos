# coldeos

## Introduction
This is the tentative set of scripts that I am using to sign EOS transactions offline, from a "cold storage" computer.
I'm making them available in case they can be of use as a reference for anyone.
If you find any bugs or have comments, please let me know.

## Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Disclaimer Part 2

Really, I am a software engineer but am definitely not a security expert. This software is intended as a reference point only.
I genuinely cannot guarantee that this method is secure against any or all threats and/or attacks.
You should only use this code as a reference if you are able to fully understand it, check it for bugs,
and take responsibility for keeping your private keys and other property secure.

## Installation

First, check that you have `node` and `npm` installed, or else install them at https://nodejs.org:
```
node -v
npm -v
```
These scripts have been developed against `node v8.11.1`, `npm 6.1.0`.

Then, create a directory called `cold`, and inside there install `eosjs` (the javascript library for working with EOS) and `coldeos`:
```
mkdir cold
cd cold
npm i eosjs
git clone https://github.com/grock999/coldeos.git
```
These scripts have been developed against `eosjs 13.0.1`.

Note that, once this directory is created from an online computer, it can be copied to an offline, "cold storage" computer.

## Use
### Save a transaction to file a text editor
First, start by using a text editor to create a transaction in JSON format, and storing it to disk.
E.g., save the following transaction to the file `tv.txt`:
```
{
    "actions": [
        {
            "account": "eosio",
            "name": "voteproducer",
            "authorization": [
                {
                    "actor": "junglehacker",
                    "permission": "active"
                }
            ],
            "data": {
                "voter": "junglehacker",
                "proxy": "",
                "producers": [
                    "lioninjungle",
                    "badgerbadger"
                ]
            }
        }
    ]
}
```

### Start the transaction by talking to the block chain
The first step is to talk to the block chain. (We at least need to get the `chain_id`, and determine
a suitable expiration time.)
For this, use the `start.js` script from `coldeos`.

You will need to know the `httpEndpoint` the instance of `nodeos` you are connecting to.
If you are running locally, this will probably be `http://127.0.0.1:8888`.
If you are connecting to, e.g., the Jungle test network, your endpoint might be `http://dev.cryptolions.io:38888`.

Use this endpoint, and the filename of the raw transaction you created in the last step as follows, saving the output
to a new file, which we'll call `uv.txt`:
```
node coldeos/start.js http://127.0.0.1:8888 tv.txt > uv.txt
```

The transaction created will have an expiration time of 20 minutes beyond the time of the reference block.
You can change the code if you prefer a different behavior.

### Sign the transaction
The following step can be computed offline. In this step, the user must enter their EOS private key. It is up to you to
make sure that you are doing this in a secure environment. Again, this software is provided as a reference only, and you
must take responsibility for securing your private key.

To sign the instantiated transaction in `uv.txt`, writing the output to `tv.txt`, use the command:
```
node coldeos/sign.js uv.txt sv.txt
```
The file `sv.txt` will now contain a signature, and can be broadcast to the blockchain.

### Broadcast the transaction
To broadcast a signed transaction, we can use the `push.js` script.
We again need to pass in the `httpEndpoint` as an argument. E.g.:
```
node coldeos/push.js http://127.0.0.1:8888 sv.txt
```

### Conclusion
If all of these commands succeed, you will have broadcast a transaction to the network.
If any of the commands fail, an error will be printed to the screen. In case of an error, try to figure out what went
wrong. If suitable, file a bug.

Remember, this software is only provided as a reference. You should not attempt to execute this software unless you
are an expert, who can understand what the code says, and who understands the principles of cryptographic security.
