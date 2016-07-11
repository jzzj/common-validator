# common-validator
validator, for everywhere

# usage looks like below:
```js
this.validator = new Validator({
    phone: {
        message: "请填写电话号码",
        value: ()=>this.state.phone,
        patterns: [{
            reg: /^\d{11}$/,
            message: "电话号码应为11位数字"
        }]
    },
    captcha: {
        message: "请填写验证码",
        value: ()=>this.state.captcha,
        patterns: [{
            reg: /^\d{4}$/,
            message: key=>{
              //todo...
            }
        }]
    }
}, function validateFailureHandler(key, message){
    /*
    do your own logic. like:
    this.setState({
        [key+"Msg"]: message
    })
    */
}.bind(this));

let result = this.validator.checkAll();
if(result){
    //check passed.
}


this.render = function(){
    let {validator} = this;
    return (
        <View>
            <input onBlur={validator.get('phone') || validator.getPhone}/>
            <InputComponent validator={validator.get('xxx') || validator.getXxx}/>
        </View>
    );
}

InputComponent extends React.Component(){
    
}
```
