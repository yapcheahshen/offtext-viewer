const QUOTEPREFIX='\u001a'
const QUOTEPAT=/\u001a(\d+)/g
export const OFFTAG_REGEX_G=/\^([A-Za-z_]+[#\.~A-Za-z_\-\d]*)(\[(?:\\.|.)*?\])?/g
export const QSTRING_REGEX_G= /"((?:\\.|.)*?)"/g
/*
verse  <l></l>
dictionary
   entry
      form
      pron 發音
      syll syllabification
      gram grammar
      gen gender
      pos part of speech
      hom
      sense
      def
      usg
      xr
      etym
      re 相關 
      note

      ptr

app
   rdg wit=  
   lem

   ^ap[ wit1=x wit2=y lemma]

proper name

footnote

inline note
*/
const parseCompactAttr=str=>{
    const arr=str.split(/([#~])/);
    const out={};
    while (arr.length) {
        const v=arr.shift();
        if (v==='~') {
            out['~']=arr.shift();
        } else if (v==='#') {
            out['#']=arr.shift(); 
        } else {
            out.n=v;
        }
    }
    return out;
}
export default function parse(str){
    const tags=[];
    let textlength=0,prevoff=0;
    let text=str.replace(OFFTAG_REGEX_G,
    (m,rawT,rawA,offset)=>{
        let putback='';
        let [m2, tagName, compactAttr]=rawT.match(/([A-Za-z_]*)(.*)/);

        let quotes=[];
        const getqstr=(str,withq)=>str.replace(QUOTEPAT,(m,qc)=>{
            return (withq?'"':'')+quotes[parseInt(qc)]+(withq?'"':'');
        });

        let raw=rawA?rawA.substr(1,rawA.length-2).replace(QSTRING_REGEX_G,(m,m1)=>{
            quotes.push(m1);
            return QUOTEPREFIX+(quotes.length-1);
        }):'';

        const arr=raw.split(/( +)/);

        const attrs={};
        let i=0,width=0;
        if (compactAttr) Object.assign(attrs, parseCompactAttr(compactAttr));
        while (arr.length) {
            const it=arr.shift();
            let eq=-1,key='';
            if (it[0]=='~' || it[0]=='#' || it[0]=='@')  {
               key=it[0];
               eq=0;
            } else {
               eq=it.indexOf('=');
               if (eq>0) key=it.substr(0,eq);
            }
            if (eq>-1) {
                attrs[key] = getqstr(it.substr(eq+1));
                if (arr.length && !arr[0].trim()) arr.shift() ;//drop the following space
            } else {
                putback+=getqstr(it,true);
            }
            i++
        }

        putback=putback.trimRight(); //remove tailing blank
        if (tagName=='br' && !putback) { //put a blank space infront, for English
            putback=' ';
            offset++
        }
        textlength+= offset-prevoff;

        const W=attrs['~'];
        if (W && !isNaN(parseInt(W))) {
            width=parseInt(W);
            delete attrs['~'];
        }
        
        // if (putback.length&&width) console.log('override width setting');

        width=putback.length?putback.length:width;
        if (!width && (offset==0 || str[offset-1]=='\n')) {
            width=-1; //to end of line
        }
        tags.push( [tagName, attrs, textlength, width]);
        textlength+=putback.length - m.length;
        prevoff=offset;
    

        return putback;
    })

    return {text,tags}
}