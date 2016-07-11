export default class Validator{
    constructor(config, handler){
        /*config like this:
        config = {
            phone: {
                required: bool/function,
                value: function,
                patterns: [{
                    reg: reg/function,
                    message: string/function
                }]
            },
            address: [{
                required: bool/function,
                value: function,
                patterns: [{
                    reg: reg/function,
                    message: string/function
                }]
            }]
        }
        */
        this.config = config;
        for(let key in config){
            //key[0] only support ie8+.
            this["get"+key.replace(/^./, key[0].toUpperCase())] = this.get(key);
        }

        if(typeof handler==='function'){
            this.handler = handler;
        }
    }

    get(key){
        return function(){
            return new Validator({
                [key]: this.config[key]
            });
        };
    }

    checkAll(){
        let config = this.config;
        for(let key in config){
            if(this.check(key, config[key]) !== true){
                this.resetConfig();
                return false;
            }
        }
        this.resetConfig();
        return true;
    }

    resetConfig(){
        delete this._withoutPrompt;
        delete this._checkWithEmptyCase;
        delete this._checkWithoutEmptyCase;
        return this;
    }

    checkWithoutPrompt(){
        this._withoutPrompt = true;
        return this;
    }

    checkWithoutEmptyCase(){
        this._checkWithoutEmptyCase = true;
        return this;
    }

    checkWithEmptyCase(){
        this._checkWithEmptyCase = true;
        return this;
    }

    check(key, config){
        if(!key)return this.checkAll();

        let {patterns, required, value} = config;
        
        if(typeof(value)==='function'){
            value = value();
        }
        
        required = typeof(required)==='function' ? required() : required;

        let configMessage = config.message || config.emptyMessage || config.emptyFunction;
        if(this._checkWithoutEmptyCase !== true){
            //config.required默认为true
            if(!value && required===false){
                return true;
            }else if(!value){
                if(this._withoutPrompt===true){
                    return false;
                }
                return this.error(configMessage, key);
            }else if(value && this._checkWithEmptyCase===true){
                return true;
            }
        }
        
        if(patterns&&patterns.length){
            let pattern, reg, result;
            for(let i=0, len=patterns.length; i<len; i++){
                pattern = patterns[i];
                reg = pattern.reg;
                result = typeof(reg) === 'function' ? reg(value) : reg.test(value);
                if(result!==true){
                    if(this._withoutPrompt===true){
                        return false;
                    }
                    return this.error(pattern.message || configMessage, key);
                }
            }
        }
        return true;
    }

    error(message, key){
        if(this.handler){
            return this.handler(message, key);
        }
        var type = typeof message;
        if(type==='string'){
            //do default error showing
            alert(message);
        }else if(type === 'function'){
            message(key);
        }else{
            alert(key+' check falied. message: '+message);
        }
        return key;
    }
}

