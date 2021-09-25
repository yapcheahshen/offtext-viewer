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
            T.push( [tagoffset,,name,attrs] );         //open tag
            tagcount++;
            //decide where to close tag
            if (width==-1) {
                T.push([ offset+line.length , tagcount ]); //close at end of this line
            } else if (width>0) {
                T.push([ tagoffset+width, tagcount ]); // close after n characters
            } else if (attrs['~']) {
                const W=attrs['~'];                    //close after a string
                const cur=tagoffset-offset;
                const pos=line.indexOf(W,cur);
                if (pos>-1) {
                    T.push([offset+pos+W.length, tagcount ]);
                } else {
                    console.log('not found',W,tag);
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

export default function render(content,tags,opts={}){
    const T=toHtmlTag(content,tags);
    let output='';
    let activecls=[];//active classes
    let prev=0,tagcount=0;
    for(let i=0;i<T.length;i++) {
        const [offset,closing,cls,attrs] = T[i];
        if (closing) {
            output+=content.substring(prev, offset) +'</t i='+closing+'>';
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
            output+='<t i='+tagcount+' class="'+clss.join(' ')+'">';
            activecls.push([tagcount,cls]);
        }
        prev=offset;
    }
    output+=content.substr(prev);
    if (opts.autop) {
        return '<p>'+output.replace(/\n{2,}/,'</p><p>')+'</p>';
    } else return output;
}