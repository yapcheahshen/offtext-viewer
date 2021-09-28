import {OFFTAG_REGEX_G,QSTRING_REGEX_G} from 'pitaka/format'
export default function (s){
    return s.replace(OFFTAG_REGEX_G,(m,cls,rawattr)=>{
        let html='';
        if (rawattr) {
            const attr=rawattr.substr(1,rawattr.length-2).replace(QSTRING_REGEX_G,(m,m1)=>{
                return m1.replace(/ /g,'\u001a');
            });
            const attrs=attr.split(/( +)/).map(item=>item.replace(/\u001a/ug,' '));
            
            html+='<span class="offtag-attributes"><span class="offtag-bracket">[</span>';
            let keyval=false;
            attrs.forEach(a=>{
                if (a.trim()){
                    const at=a.indexOf('=');
                    keyval=true;
                    if (at>0) {
                        html+='<span class="offtag-attr">'+a.substr(0,at)+'</span>'+
                        '<span class="offtag-op">=</span>'+
                        '<span class="offtag-val">'+a.substr(at+1)+'</span>';
                    } else if (a[0]=='#' ||a[0]=='~') {
                        html+='<span class="offtag-attr">'+a.substr(0,1)+'</span>'+
                        '<span class="offtag-val">'+a.substr(1)+'</span>';
                    } else {
                        html+='<span class="offtag-putback">'+a+'</span>';
                        keyval=false;
                    }
                } else {
                    const sty=keyval?'blank':'putback';
                    html+='<span class="offtag-'+sty+'">'+a+'</span>';
                }
            })
            
            html+='<span class="offtag-bracket">]</span></span>';
        }


        return '<span class="offtag-op">^</span><span class="offtag-name">'+cls+'</span>'
        +html;
    });
}