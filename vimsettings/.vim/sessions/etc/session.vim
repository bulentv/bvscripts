let SessionLoad = 1
if &cp | set nocp | endif
map  h
let s:cpo_save=&cpo
set cpo&vim
map <NL> j
map  k
map  l
map   /
vnoremap <silent> # :call VisualSearch('b')
vnoremap $e `>a"`<i"
vnoremap $q `>a'`<i'
vnoremap $$ `>a"`<i"
vnoremap $3 `>a}`<i{
vnoremap $2 `>a]`<i[
vnoremap $1 `>a)`<i(
vnoremap <silent> * :call VisualSearch('f')
map ,bb :cd ..
map ,pp :setlocal paste!
map ,q :e ~/buffer
map ,m :call MakeSession()
noremap ,y :CommandTFlush
noremap ,j :CommandT
map ,f :MRU
map ,s? z=
map ,sa zg
map ,sp [s
map ,sn ]s
map ,ss :setlocal spell!
map ,u :TMiniBufExplorer
map ,o :BufExplorer
map ,p :cp
map ,n :cn
map ,cc :botright cope
map ,cd :cd %:p:h
map ,tm :tabmove
map ,tc :tabclose
map ,te :tabedit
map ,tn :tabnew
map ,ba :1,300 bd!
map ,bd :Bclose
map <silent> , :noh
map ,g :vimgrep // **/*.<Left><Left><Left><Left><Left><Left><Left>
map ,e :e! ~/.vim_runtime/vimrc
nmap ,w :w!
map 0 ^
cmap ½ $
imap ½ $
vmap gx <Plug>NetrwBrowseXVis
nmap gx <Plug>NetrwBrowseX
vnoremap <silent> gv :call VisualSearch('gv')
vnoremap <silent> <Plug>NetrwBrowseXVis :call netrw#BrowseXVis()
nnoremap <silent> <Plug>NetrwBrowseX :call netrw#BrowseX(expand((exists("g:netrw_gx")? g:netrw_gx : '<cfile>')),netrw#CheckIfRemote())
map <C-PageDown> :tabn
map <C-PageUp> :tabp
map <C-Space> ?
cnoremap  <Home>
cnoremap  <End>
cnoremap  
cnoremap  <Down>
cnoremap  <Up>
inoremap <expr> [200~ XTermPasteBegin()
inoremap $t <>i
inoremap $e ""i
inoremap $q ''i
inoremap $4 {o}O
inoremap $3 {}i
inoremap $2 []i
inoremap $1 ()i
cnoremap $q eDeleteTillSlash()
cnoremap $c e eCurrentFileDir("e")
cnoremap $j e ./
cnoremap $d e ~/Desktop/
cnoremap $h e ~/
vmap ½ $
nmap ½ $
omap ½ $
vmap ë :m'<-2`>my`<mzgv`yo`z
vmap ê :m'>+`<my`>mzgv`yo`z
nmap ë mz:m-2`z
nmap ê mz:m+`z
iabbr xdate =strftime("%d/%m/%y %H:%M:%S")
let &cpo=s:cpo_save
unlet s:cpo_save
set autoindent
set autoread
set background=dark
set backspace=eol,start,indent
set cmdheight=2
set expandtab
set fileencodings=ucs-bom,utf-8,default,latin1
set fileformats=unix,dos,mac
set grepprg=/bin/grep\ -nH
set helplang=en
set hidden
set history=700
set hlsearch
set ignorecase
set incsearch
set laststatus=2
set matchtime=2
set nomodeline
set pastetoggle=<F2>
set printoptions=paper:a4
set ruler
set runtimepath=~/.vim,~/.vim/bundle/json5.vim,~/.vim/bundle/nerdtree,~/.vim/bundle/vim-es6,~/.vim/bundle/vim-pug,~/.vim/bundle/vim-stylus,/var/lib/vim/addons,/usr/share/vim/vimfiles,/usr/share/vim/vim80,/usr/share/vim/vimfiles/after,/var/lib/vim/addons/after,~/.vim/after
set shiftwidth=2
set showmatch
set smartcase
set smartindent
set smarttab
set statusline=\ %{HasPaste()}%F%m%r%h\ %w\ \ CWD:\ %r%{CurDir()}%h\ \ \ Line:\ %l/%L:%c
set suffixes=.bak,~,.swp,.o,.info,.aux,.log,.dvi,.bbl,.blg,.brf,.cb,.ind,.idx,.ilg,.inx,.out,.toc
set noswapfile
set switchbuf=usetab
set tabline=%!TabLine()
set tabstop=2
set textwidth=500
set timeoutlen=500
set undodir=~/.vim_runtime/undodir
set undofile
set whichwrap=b,s,<,>,h,l
set wildignore=*.o,*.obj,.git,*.pyc
set wildmenu
set nowritebackup
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd /etc
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +0 ~/.npmrc
argglobal
silent! argdel *
$argadd ~/.npmrc
edit ~/.npmrc
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winminheight=1 winheight=1 winminwidth=1 winwidth=1
argglobal
setlocal keymap=
setlocal noarabic
setlocal autoindent
setlocal backupcopy=
setlocal balloonexpr=
setlocal nobinary
setlocal nobreakindent
setlocal breakindentopt=
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
setlocal colorcolumn=
setlocal comments=s1:/*,mb:*,ex:*/,://,b:#,:%,:XCOMM,n:>,fb:-
setlocal commentstring=/*%s*/
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal nocopyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
setlocal nocursorline
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != ''
setlocal filetype=
endif
setlocal fixendofline
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldmarker={{{,}}}
setlocal foldmethod=manual
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=tcq
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal formatprg=
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=-1
setlocal include=
setlocal includeexpr=
setlocal indentexpr=
setlocal indentkeys=0{,0},:,0#,!^F,o,O,e
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255
setlocal keywordprg=
set linebreak
setlocal linebreak
setlocal nolisp
setlocal lispwords=
setlocal nolist
setlocal makeencoding=
setlocal makeprg=
setlocal matchpairs=(:),{:},[:]
setlocal nomodeline
setlocal modifiable
setlocal nrformats=bin,octal,hex
setlocal nonumber
setlocal numberwidth=4
setlocal omnifunc=
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norelativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal shiftwidth=2
setlocal noshortname
setlocal signcolumn=auto
setlocal smartindent
setlocal softtabstop=0
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=
setlocal suffixesadd=
setlocal noswapfile
setlocal synmaxcol=3000
if &syntax != ''
setlocal syntax=
endif
setlocal tabstop=2
setlocal tagcase=
setlocal tags=
setlocal termkey=
setlocal termsize=
setlocal textwidth=500
setlocal thesaurus=
setlocal undofile
setlocal undolevels=-123456
setlocal nowinfixheight
setlocal nowinfixwidth
setlocal wrap
setlocal wrapmargin=0
silent! normal! zE
let s:l = 85 - ((56 * winheight(0) + 30) / 60)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
85
normal! 019|
tabnext 1
if exists('s:wipebuf')
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 shortmess=filnxtToO
set winminheight=1 winminwidth=1
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
