(this.webpackJsonpkurssitiedot=this.webpackJsonpkurssitiedot||[]).push([[0],{14:function(e,t,n){e.exports=n(37)},36:function(e,t,n){},37:function(e,t,n){"use strict";n.r(t);var a=n(2),r=n(0),u=n.n(r),l=n(13),c=n.n(l),o=n(3),i=n.n(o),s="/api/persons",m=function(){return i.a.get(s).then((function(e){return e.data}))},f=function(e){return i.a.post(s,e).then((function(e){return e.data})).catch((function(e){return console.log(e.message)}))},d=function(e){return console.log("".concat(s,"/").concat(e)),i.a.delete("".concat(s,"/").concat(e)).then()},h=(n(36),function(e){var t=e.message,n=e.status;return null===t?null:u.a.createElement("div",{className:n?"succesess":"error"},t)}),b=function(e){var t=e.person,n=e.handleDelete;return u.a.createElement("p",null," ",t.name," ",t.number,u.a.createElement("button",{onClick:function(){return n(t.id,t.name)}}," Delete "))},p=function(e){var t=e.people,n=e.handleDelete;return t.map((function(e){return u.a.createElement(b,{key:e.name,person:e,handleDelete:n})}))},g=function(e){return u.a.createElement(u.a.Fragment,null,u.a.createElement("h2",null,"Add new person"),u.a.createElement("form",{onSubmit:e.addPerson},u.a.createElement("div",null,"name:",u.a.createElement("input",{value:e.newName,onChange:e.changeName})),u.a.createElement("div",null,"number:",u.a.createElement("input",{value:e.newNumber,onChange:e.changeNumber})),u.a.createElement("div",null,u.a.createElement("button",{type:"submit"},"add"))))},E=function(e){return u.a.createElement(u.a.Fragment,null,u.a.createElement("p",null,"filter shown with: "),u.a.createElement("input",{value:e.filterName,onChange:e.changeFilter}))},v=function(){var e=Object(r.useState)([]),t=Object(a.a)(e,2),n=t[0],l=t[1],c=Object(r.useState)(""),o=Object(a.a)(c,2),i=o[0],s=o[1],b=Object(r.useState)(""),v=Object(a.a)(b,2),w=v[0],N=v[1],j=Object(r.useState)(""),O=Object(a.a)(j,2),k=O[0],y=O[1],C=Object(r.useState)(null),D=Object(a.a)(C,2),S=D[0],P=D[1],F=Object(r.useState)(!1),T=Object(a.a)(F,2),x=T[0],J=T[1];u.a.useEffect((function(){return m().then((function(e){return l(e)}))}),[]);var L=n.filter((function(e){return e.name.toLowerCase().includes(k.toLowerCase())}));return u.a.createElement("div",null,u.a.createElement(h,{message:S,status:x}),u.a.createElement("h2",null,"Phonebook"),u.a.createElement(E,{filterName:k,changeFilter:function(e){y(e.target.value)}}),u.a.createElement(g,{addPerson:function(e){var t=n.filter((function(e){return e.name===i})),a={name:i,number:w};e.preventDefault(),0===i.length||0===w.length?(P("Please, fill out all of the fields before submitting!"),J(!1),setTimeout((function(){P(null)}),5e3)):t.length>0?(P("Person already exists"),J(!1)):(f(a).then((function(e){l(n.concat(e)),P("New person ".concat(i," added to your phonebook!")),J(!0)})).catch((function(e){P("Could not create a new person, please try again."),J(!1)})),setTimeout((function(){P(null,!1)}),5e3),s(""),N(""))},newName:i,changeName:function(e){s(e.target.value)},newNumber:w,changeNumber:function(e){N(e.target.value)}}),u.a.createElement("h2",null,"Numbers"),u.a.createElement(p,{people:L,handleDelete:function(e,t){window.confirm("Delete ".concat(t))&&(d(e).then((function(a){l(n.filter((function(t){return t.id!==e}))),P("Person ".concat(t," deleted from your phonebook!")),J(!0)})).catch((function(e){P("Could not delete the person, please try again."),J(!1)})),setTimeout((function(){P(null)}),5e3))}}))};c.a.render(u.a.createElement(v,null),document.getElementById("root"));t.default=v}},[[14,1,2]]]);
//# sourceMappingURL=main.0c2f8f52.chunk.js.map