const toHtmlTag=(content,tags)=>{
    const T=[];
    const lines=content.split(/\r?\n/);
    let offset=0;  //offset of content
    let ntag=0,tag=tags[ntag], tagcount=0;
    for (let i=0;i<lines.length;i++) {
        const line=lines[i];
        while (ntag<tags.length && tag) {
            const [name, attrs, tagoffset, width] = tag;
            if (tagoffset> offset+line.length) break; //tag not in this line
            const bol=(tagoffset==offset) && (width==-1 || width==0);
            T.push( [tagoffset,,name,attrs,bol] );         //open tag
            tagcount++;
            //decide where to close tag
            if (width<0) {
                const dist=line.length - (-width-1);
                T.push([ offset+ (dist>0?dist:0) , tagcount ]); // 從行末倒數
            } else if (width>0) {
                T.push([ tagoffset+width, tagcount ]); // close after n characters
            } else if (attrs['~']) {
                const W=attrs['~'];                    //close after a string
                const cur=tagoffset-offset;
                const pos=line.indexOf(W,cur);
                if (pos>-1) {
                    T.push([offset+pos+W.length, tagcount ]);
                } else {
                    T.push([tagoffset, tagcount ]);
                }
            } else {                                 
                T.push([tagoffset, tagcount]);            //close right after
            }
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