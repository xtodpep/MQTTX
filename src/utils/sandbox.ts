import { NodeVM, VM, VMScript } from 'vm2'

const executeScript = (
  script: string,
  payloadType: PayloadType,
  input: Buffer,
  msgType: MessageType,
  index?: number,
): string => {
  let output = ''
  console.log('test...')
  try {
    let ext = {}
    const vm = new NodeVM({
      timeout: 10000,
      sandbox: {
        execute(callback: (value: any, msgType: MessageType, index?: number) => any) {
          let _inputValue = input
          if (payloadType === 'JSON' && typeof input === 'string') {
            _inputValue = JSON.parse(input)
          }
          let _output = callback(_inputValue, msgType, index)
          console.log('test..asdasd')
          console.log(_output)
          console.log('test..asdasd')
          if (_output === undefined) {
            _output = 'undefined'
          } else if (_output === null) {
            _output = 'null'
          } else {
            _output = _output.toString()
          }
          ext = _output
          return _output
        },
      },
      eval: false,
      wasm: false,
      require: {
        builtin: ['fs', 'path', 'util'],
        external: true,
      },
    })
    const _script = new VMScript(script)
    output = vm.run(_script)
    console.log(ext)
    return ext.toString()
  } catch (error) {
    // @ts-ignore
    output = error.toString()
    console.log(output)
    return output
  }
}

export default { executeScript }
