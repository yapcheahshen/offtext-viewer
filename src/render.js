import {TNAME,TPOS,TATTR,TWIDTH,TLINE} from 'pitaka/format';

const toHtmlTag=(content,tags)=>{
    const T=[];
    const lines=content.split(/\r?\n/);
    let offset=0;  //offset of content
    let ntag=0,tag=tags[ntag], tagcount=0;
    for (let i=0;i<lines.length;i++) {
        const line=lines[i];
        while (ntag<tags.length && tag) {
            let w=tag[TWIDTH];
            if (tag[TLINE]!==i) break;           //tag beyond in this line
            const bol=(tag[TPOS]==offset) && (w==-1 || w==0);  
            T.push( [offset+tag[TPOS],,tag[TNAME], tag[TATTR],bol] );  //open tag
            tagcount++;
            if (w==-1) w=line.length; // 從行末倒數
            T.push([ offset+tag[TPOS]+w, tagcount ]); // close after n characters
            ntag++;
            tag=tags[ntag];
        }
        offset+=1+lines[i].length;
    }

    T.sort((a,b)=>{
        if (a[0]==b[0]) { //multiple closing tag at same position
            return b[1]-a[1]; //closing the nearer tag
        } else return a[0]-b[0];//sort by offset
    })
    return T;
}
const htmlAttrs=attrs=>{
    let s='';
    for (let name in attrs) {
        let aname=name;
        if (name=='#') aname='id';
        if (name=='~') continue;
        s+=' '+aname+'="'+attrs[name]+'"';
    }
    return s;
}
export default function render(content,tags,opts={}){
    const T=toHtmlTag(content,tags);
    let output='';
    let activecls=[];//active classes
    let prev=0,tagcount=0;
    for(let i=0;i<T.length;i++) {
        const [offset,closing,cls,attrs,bol] = T[i];
        if (cls=='br'||cls=='r') {
            tagcount++;
            output+=content.substring(prev, offset)+'<br i='+tagcount+htmlAttrs(attrs)+'>';
            prev=offset;
            continue;
        }
        if (closing) {
            output+=content.substring(prev, offset) +'</t '+closing+'>';
            activecls=activecls.filter( c=>c[0]!==closing); 
            if (activecls.length) {
                output+='<t class="'+activecls.map(c=>c[1]).join(" ")+'">';
            }        
        } else {
            output+=content.substring(prev,offset);
            let clss=[cls];
            if (activecls.length) {
                output+='</t>';
                clss=clss.concat(activecls.map(c=>c[1]));
            }
            tagcount++;
            output+='<t i='+tagcount+' class="'+clss.join(' ')+'"'+htmlAttrs(attrs)+'>';
            
            //do not repeat per-paragraph styling
            if (!bol) activecls.push([tagcount,cls]);
        }
        prev=offset;
    }
    output+=content.substr(prev);
    if (opts.p) {
        return '<p>'+output.replace(/\n{2,}/,'</p><p\n>')+'</p>';
    } else return output;
}