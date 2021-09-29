import { writable } from "svelte/store";
const daode=`^book道德經
^red[Dao De Jin]
道，可道也，非^rev[恆 帛書=常]道也。名，可名也，非^rev[o=常 恆]名也。
無，名^u[~物]天地之始；有，名^b[萬物之母]。
故，常^b~3無，欲以觀其妙；常^b[有]，欲以^b觀其徼。
^g~-6此兩者，同出而異名，同謂之玄。玄之又玄，眾妙之門。

^g五色令人目盲；^r五音令人耳聾；^br五味令人口爽；
馳騁畋獵，令人心發狂；難得之貨，令人行妨。
^li是以聖人為^b[腹]不為目，故去彼取此。`

const overlap=`^b[~聾]五色令人^u目盲；^red[~味]五音令人耳聾；五^i[味令人]口爽；`
const listitem=`^li五色令人目盲；^b[五音]令人^r耳聾；^li五味令人口爽`
const footnotes=`^book同出^u而異^w[pli=nama 名]，同謂之^fn4玄。玄之^pb100又玄，^fn2[眾妙]之門`
export const editingtext=writable(footnotes);

