# Warning

## 2021-03-27
Note that in `package.json` both `vue` and `@vue/compiler-sfc` and currently version-limited to *exactly* `3.0.6`.
I realise this is less than ideal.

This is because something about later versions (current is `3.0.8` at time of writing) screws up how _Vue Test Utils_
mounts `<select>` options when the `<select>` has a `v-model` (or possibly because the `v-model` is asynchronously loaded
from a remote call? Dunno.

This results in `"Cannot read property 'length' of undefined"` in `setSelected` in
`node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.jsruntime-dom.esm-bundler.js`
when it evaluates `el.options.length`, when the component is first `shallowMount`-ed. Around line `2021` in the
version of that file I'm looking at.

This is because the `options` array apparently is not even defined if it's empty (which seems like a bug to me).

That specific code is the same in `3.0.6` as it is in `3.0.8`, so it must be some upstream code that's messing it up.
I CBA digging into it further.

Note that the component works A-OK in a browser environment, so am guessing Vue itself is not doing anything 
wrong; it's how the test utils are mounting the component.
Although I guess if Vue has changed things so that that `options` array might not now exist, then that's not so cool.

I'll give it a month or so and try with a more liberal version constraint, to see if it starts working again.
