<?php

/**
 * Only used for tests (with GET params).
 */

require('./src/commands.php');

$db = new DataBase();
$action = $_GET['action'];

$quotesRaw = '{"fr":"C\'est difficile de battre quelqu\'un qui n\'abandonne jamais. ","en":"It\'s hard to beat someone who never give up."};Babe Ruth
{"fr":"Cher moi, un jour, je te rendrai fier. ","en":"Dear me, one day I\'ll make you proud."};Charlotte Eriksson
{"fr":"Chaque jour tu n\'as qu\'une tâche à accomplir : être meilleur qu\'hier","en":"Everyday you have one job, be better than yesterday."};Ada Ehi
{"fr":"Concentrez vos pensées sur la chose en particulier qui vous intéresse le plus et les idées viendront en abondance et ouvriront la porte à une douzaine de façons d\'atteindre votre objectif.","en":"Focus your thoughts on the particular thing that interests you most, and the ideas will come flooding in, opening the door to a dozen ways of achieving your goal."};Robert Collier
{"fr":"Ne dites jamais à personne ce que vous faites tant que ce n\'est pas fait. ","en":"Never tell anyone what you\'re doing until it\'s done."}
{"fr":"Peu importe ce que tu veux faire, fais le maintenant. On repousse trop souvent aux lendemains.","en":"Whatever you want to do, do it now. Too often, we put things off until tomorrow."}
{"fr":"Le moment ne sera jamais le bon. Commencez de là où vous êtes et travaillez avec les outils qui se trouvent sous votre main. Vous trouverez de meilleurs outils au fur et à mesure.","en":"The timing will never be right. Start where you are and work with the tools at hand. You\'ll find better tools as you go along."}
{"fr":"Ton manque de sérieux est une insule à ceux qui croient en toi.","en":"Your lack of dedication is an insult to those who believe in you."}
{"fr":"Je ne te souhaite pas bonne chance, je te souhaite de travailler à la hauteur de tes objectifs.","en":"I don\'t wish you good luck, I wish you to work towards your goals."}
{"fr":"La vie n\'est pas un jeu, car dans un jeu, vous jouez contre quelqu\'un d\'autre, si vous perdez, ils gagnent, si vous gagnez, ils perdent. Dans la vie, vous ne jouez contre personne et la victoire ou la défaite d\'une autre personne n\'a aucun effet sur vous.","en":"Life is not a game because in a game you\'re playing against someone else, if you lose they win, if you win they lose. In life, you\'re not playing against anyone and someone else winning or losing has no effect on you."}
{"fr":"Tu peux. Fin de la discussion. ","en":"You can. End of story."}
{"fr":"Soyez accro à votre passion au lieu de vous laisser distraire.","en":"Be addicted to your passion instead of distraction."}
{"fr":"Vous devez faire en sorte que ce soit amusant et agréable dans votre esprit afin de vous bouger et de faire les choses difficiles.","en":"You have to make it fun and enjoyable in your own mind to get up and do the hard things."}
{"fr":"Le problème n\'est pas le problème. Le problème, c\'est l\'attitude que vous adoptez à l\'égard du problème","en":"The problem is not the problem. The problem is your attitude about the problem"};Captain Jack Sparrow
{"fr":"Le talent ca s\'épanouit, l\'instint ca se perfectionne.","en":"Talent grows, instinct improves."};Oikawa Tooru
{"fr":"On ne peut pas gagner sans motivation.","en":"You can\'t win without motivation."};Daichi Sawamura
{"fr":"Les gens ne cesseront jamais d\'avoir des rêves !","en":"People will never stop having dreams!"};Marshall D Teach
{"fr":"Le talent touche une cible que personne d\'autre ne peut frapper. le génie touche une cible que personne d\'autre ne peut voir.","en":"Talent hits a target no one else can hit. genius hits a target no one else can see."};Arthur Schopenhauer
{"fr":"Ce qui compte c\'est pas d\'avoir beaucoup de temps , c\'est de savoir s\'en servir.","en":"It\'s not about having a lot of time, it\'s about knowing how to use it."};Ekko
{"fr":"Les limites existent uniquement si tu le permets.","en":"Limits only exist if you allow them to."};Vegeta
{"fr":"Je ne crains pas l\'homme qui a pratiqué 10.000 coups une fois, mais je crains l\'homme qui a pratiqué un coup 10.000 fois.","en":"I don\'t fear the man who has practiced 10,000 moves once, but I do fear the man who has practiced one move 10,000 times."};Bruce Lee
{"fr":"Tous les hommes finissent par mourir un jour... Mais leur savoir reste.","en":"All men die one day... But their knowledge remains."};Senku Ishigami
{"fr":"Ne pas avoir peur est la chose la plus terrifiante qui sois.","en":"Not being afraid is the most terrifying thing of all."};Karma Akabane
{"fr":"En ce bas monde, la seule chose qui nous appartient vraiment... c\'est le corps qu\'on se forge chaque jour.","en":"In this world, the only thing that truly belongs to us... is the body we forge for ourselves every day."};Ken Kitano
{"fr":"Le fait d\'être visé par tout le monde montre votre puissance.","en":"Being targeted by everyone shows your power."};Professeur Koro
{"fr":"Vous riez de moi car je suis différent mais moi je ris de vous car vous êtes tous les mêmes. Kaneki Ken","en":"You laugh at me because I\'m different, but I laugh at you because you\'re all the same. "};Kaneki Ken
{"fr":"L\'homme qui n\'a rien à perdre est le plus dangereux de tous les adversaires.","en":"The man with nothing to lose is the most dangerous of all."};Chris Carter
{"fr":"Ne pleure pas pour ta défaite, garde tes larmes pour la victoire","en":"Don\'t cry for your loss, save your tears for victory"};Natsu Dragnir
{"fr":"La chute n\'est pas un échec. L\'échec c\'est de rester là ou on est tombé","en":"Falling is not failure. Failure is staying where you\'ve fallen."};Socrate
{"fr":"Peu importe combien de points vous avez à la fin du jeu, si vous n\'êtes pas heureux, ce n\'est pas une victoire.","en":"No matter how many points you have at the end of the game, if you\'re not happy, it\'s not a win."};Kuroko Tetsuya
{"fr":"C\'est le véritable secret de la vie que d\'être complètement engagé dans ce que l\'on fait ici et maintenant. Et au lieu d\'appeler cela du travail, réalisez que c\'est du jeu.","en":"This is the real secret of life to be completely engaged with what you are doing in the here and now. And instead of calling it work, realize it is play."};Alan Watts
{"fr":"S\'il y\'a la moindre possibilité, il est de ton devoir d\'avancer.","en":"If there\'s the slightest possibility, it\'s your duty to move forward."};Mustang
{"fr":"La force s\'acquiert par la répétition de l\'effort. Subir la défaire et savourer la victoire, c\'est comme ça que nous grandirons !","en":"Strength comes from repetition. Endure defeat and savor victory - that\'s how we\'ll grow!"};Aoi Todo
{"fr":"Rester debout c\'est une sacrée preuve de force !","en":"Staying on your feet is one hell of a show of strength!"};Katsuki Bakugo
{"fr":"Un raté peut dépasser un génie par en entraînement acharné.","en":"A loser can surpass a genius through relentless training."};Rock Lee
{"fr":"Ne jamais remettre à demain ce que tu peux faire aujourd\'hui.","en":"Never put off until tomorrow what you can do today."};2pac
{"fr":"Je n\'ai pas ce qu\'il faut pour être le héros principal mais dans chaque bonne histoire il y a un second rôle qui éclipse le héros.","en":"I don\'t have what it takes to be the main hero, but in every good story there\'s a supporting character who outshines the hero."};Neito Monoma
{"fr":"Pour avoir quelque chose que tu n\'as jamais eu, il faut faire quelque chose que tu n\'as jamais fait.","en":"To get something you\'ve never had, you have to do something you\'ve never done."};Robert McCall
{"fr":"Quelque soit la vérité, ce sont les vainqueurs qui écriront l\'histoire.","en":"Whatever the truth, it\'s the winners who will write history."};Livaï Ackerman
{"fr":"Si vous ne faites pas les choses pour lesquelles vous n\'êtes pas doué vous ne ferez jamais de progrès.","en":"If you don\'t do the things you\'re not good at, you\'ll never make progress."};Rachel Zane
{"fr":"Pour réussir peu importe le domaine, il n\'est pas nécessaire d\'être différent. Vous devez simplement être ce que la plupart des gens ne sont pas : régulier.","en":"To be successful at anything, you don\'t have to be different. You simply have to be what most people aren\'t : consistent."}
{"fr":"Quand je dis que ça ne fait pas mal. Cela signifie que je peux le supporter.","en":"When I say it doesn\'t hurt. It means I can handle it."};Kirua zoldik
{"fr":"Dans la vie il n\'est pas interdit de pleurer, mais cela ne doit en aucun cas t\'empêcher d\'avancer.","en":"Crying is not forbidden, but it should never stop you from moving forward."};Shanks Le Roux
{"fr":"La justice vaincra t-elle ? Bien sûr que oui ! Parce que la justice n\'appartient qu\'aux vainqueurs !","en":"Will justice prevail? Of course it will! Because justice belongs only to the victors!"};Donquixote Doflamingo
{"fr":"Celui qui n\'a pas d\'objectifs ne risque pas de les atteindre","en":"If you don\'t have goals, you\'re unlikely to reach them."};Sun Tzu
{"fr":"Je ne reviens jamais sur ma parole, c\'est ça pour moi être un ninja !","en":"I never go back on my word, that\'s what being a ninja means to me!"};Naruto Uzumaki
{"fr":"Être faible n\'est pas une honte, mais le rester, si !","en":"Being weak is nothing to be ashamed of, but staying weak is!"};Fuegoleon Vermillion
{"fr":"Il n\'est de plus grand amour que celui de l\'homme qui se sacrifie pour ses compagnons.","en":"There is no greater love than that of the man who sacrifices himself for his companions."};AinzOoalGown
{"fr":"Je suis peut-être un caillou, mais je suis un caillou capable de briser un diamant.","en":"I may be a pebble, but I\'m a pebble capable of shattering a diamond."};Asta
{"fr":"L\'espoir n\'existe que pour ceux qui ne peuvent pas vivre sans s\'accrocher.","en":"Hope only exists for those who can\'t live without hanging on."};Sosuke Aizen
{"fr":"j\'ai appris que le courage n\'est pas l\'absence de peur mais la capacité de la vaincre","en":"I\'ve learned that courage is not the absence of fear, but the ability to overcome it."};Kirito
{"fr":"Tant qu\'il existera des vainqueurs il y aura des vaincus.","en":"As long as there are winners, there will be losers."};Madara Uchiwa
{"fr":"Vous êtes bien dans un jeu vidéo, mais vous n\'êtes plus là pour jouer.","en":"You\'re in a video game, but you\'re not there to play."};Sword Art Online
{"fr":"Quelqu\'un a dit : \' N\'ayez pas peur de recommencer. Cette fois-ci, vous ne partez pas de zéro, vous avez de l\'expérience \'.","en":"Someone said « Don\'t be afraid to start over again. This time you\'re not starting from scratch, you\'re starting from experience »."}
{"fr":"Une fois lancé on se dit toujours « J\'aurais du commencer plus tôt » alors fais-le maintenant pour ne pas avoir de regrets plus tard.","en":"Once you\'ve started, you always say to yourself \'I should have started sooner\', so do it now so you don\'t have any regrets later."}
{"fr":"C\'est toi contre toi. Tous les jours. Cela a toujours été le cas.","en":"It\'s you vs you. Everyday. Always has been."}
{"fr":"La réussite ce n\'est pas juste faire de l\'argent, c\'est de vivre ta propre vie comme tu l\'entends.","en":"Success isn\'t just about making money, it\'s about living your own life the way you want to."}
{"fr":"Je n\'ai qu\'un seul pouvoir, celui de ne jamais abandonner.","en":"I have one power, I never give up."};Batman
{"fr":"La manière la plus efficace de le faire est de le faire.","en":"The most effective way to do it is to do it."};Amelia Earhart
{"fr":"Ce qui compte, c\'est la volonté. Les compétences vous pourrez toujours les apprendre.","en":"It\'s the will, not the skill."};Jim Tunney
{"fr":"Il suffit de se concentrer et de le faire.","en":"Just focus and do it."}
{"fr":"Fais partie de ceux qui font ce qu\'ils disent. ","en":"Be one of the few who do what they say."}
{"fr":"Concentrez-vous sur ce que vous voulez vraiment. Tout le reste n\'est que distraction.","en":"Focus on what you really want. Everything else is a distraction."}
{"fr":"Fixez des objectifs si élevés que les gens pensent que vous êtes fou.","en":"Set your goals so high so people think you\'re insane."}
{"fr":"La seule façon de faire du bon travail est d\'aimer ce que l\'on fait. Si vous n\'avez pas encore trouvé, continuez de chercher.","en":"The only way to do great work is to love what you do. If you haven\'t found it yet, keep lookin, don\'t settle."};Steve Jobs
{"fr":"Dans le domaine des idées, tout dépend de l\'enthousiasme. Dans le monde réel, tout repose sur la persévérance.","en":"In the realm of ideas, everything depends on enthusiasm. In the real world, it\'s all about perseverance."};Johann Wolfgang von Goethe
{"fr":"C\'est clairement plus dur pour nous. Et alors ? La victoire aura deux fois plus de goût.","en":"It\'s clearly harder for us. So what? Victory will taste twice as good."}
{"fr":"Si vous êtes sur le chemin de mes rêves et de mes objectifs, je vous suggère de partir.","en":"If you are in the way of my dreams and goals, I suggest you move."}
{"fr":"Ça sera facile ? Pas du tout. Ça en vaudra la peine ? Absolument !","en":"Will it be easy? Not at all. Will it be worth it? Absolutely!"}
{"fr":"Si vous ne jouez pas pour gagner, ne jouez pas du tout.","en":"If you don\'t play to win, don\'t play at all."};Tom Brady
{"fr":"Chaque étape suivante de votre vie exigera un vous différent.","en":"Every next level of you life will demand a different you."};Leonardo Di Caprio
{"fr":"Et maintenant, allez-y, faites des erreurs intéressantes, faites des erreurs étonnantes, faites des erreurs glorieuses et fantastiques.","en":"And now go, make interesting mistakes, make amazing mistakes, make glorious and fantastic mistakes."};Neil Gaiman
{"fr":"Si vous arrêtez une fois, cela devient une habitude. N\'abandonnez jamais.","en":"If you quit once it becomes a habit. Never quit."};Michael Jordan
{"fr":"Ne pensez pas à ce qui peut arriver en un mois. Ne pensez pas à ce qui peut arriver dans un an. Concentrez-vous sur les 24 heures qui sont devant vous et faites ce que vous pouvez pour vous rapprocher de votre objectif.","en":"Don\'t think about what can happen in a month. Don\'t think about what can happen in a year. Just focus on the 24 hours in front of you and do what you can to get closer to where you want to be."};Eric Thomas
{"fr":"Laisse les te haïr, assure-toi qu\'ils épellent bien ton nom.","en":"Let them hate you, make sure they spell your name right."};Harvey Specter
{"fr":"Si vous n\'y allez pas à fond, à quoi bon y aller ?","en":"If you don\'t go all in, what\'s the point?"}
{"fr":"Arrête de vouloir te motiver. Soit tu te mets au boulot, soit tu te plais. Mais arrête de te trouver des excuses.","en":"Stop trying to motivate yourself. Either get to work or enjoy yourself. But stop making excuses."}
{"fr":"Observez et réfléchissez, et devenez chaque jour un peu plus sage.","en":"Observe and reflect, and become a little wiser every day."};Doe Zantamata
{"fr":"Vous me verrez peut-être lutter, mais vous ne me verrez jamais abandonner.","en":"You may see me struggle but you will never see me quit."}
{"fr":"Si vous ne pouvez exceller par le talent, triomphez par l\'effort.","en":"If you can\'t excel through talent, triumph through effort."};Dave Weinbaum
{"fr":"Oubliez l\'idée que vous devez constamment travailler pour réussir. Acceptez le concept selon lequel le repos, la récupération et le réflexion sont des éléments essentiels de votre progression vers une vie réussie, et, en fin de compte, heureuse. ","en":"Destroy the idea that you have to be constantly working or grinding in order to be successful. Embrace the concept that rest, recovery, and reflection are essential parts of the progress towards a successful and ultimately happy life"};Damson Idris
{"fr":"Si vous commencez maintenant, vous obtiendrez des résultats un jour plus tôt que si vous commenciez demain.","en":"If you start now you\'ll begin seeing results one day earlier than if you start tomorrow"};Jairek Robbins
{"fr":"La vie ne consiste pas à être meilleur que quelqu\'un d\'autre, mais à être meilleur que ce que l\'on était et à devenir ce que l\'on est.","en":"Life is not about being better than someone else, it\'s about being better than you used to be and becoming who you are."};Will Smith
{"fr":"Il y a un an, c\'était impossible. Aujourd\'hui, tout m\'est possible.","en":"A year ago, it was impossible. Today, anything is possible."}
{"fr":"Si vous voulez gagner le jeu de la vie, vous devez d\'abord définir ce qu\'est la victoire. Vous devez d\'abord définir ce qu\'est la victoire.","en":"If you want to win the game of life. You first have to define what winning is."};Joe Duncan
{"fr":"Si tu as le temps de t\'apitoyer, tu as le temps de t\'améliorer.","en":"If you have time to feel sorry for yourself, you have time to improve."};Saitama
{"fr":"Faites de votre vie un chef-d\'œuvre. N\'imaginez aucune limite à ce que vous pouvez être, avoir ou faire.","en":"Make your life a masterpiece. Imagine no limitations on what you can be, have or do."};Brian Tracy
{"fr":"Parfois, tout ce dont vous avez besoin, c\'est de 20 secondes de courage insensé, littéralement 20 secondes de bravoure embarrassante. Je vous promets qu\'il en sortira quelque chose de grand.","en":"Sometimes all you need is 20 seconds of insane courage, just literally 20 seconds of embarrassing bravery. I promise you something great will come out of it."};Benjamin Mee
{"fr":"L\'argent est juste un outil, pas le but.. Le but, c\'est la liberté !","en":"Money is just a tool, not the goal... The goal is freedom!"}
{"fr":"On a l\'impression d\'être fou jusqu\'à ce que ça marche, puis on devient un génie.","en":"You only look crazy until it works, then you\'re a genius."}
{"fr":"N\'oubliez jamais que le début est la partie la plus difficile.","en":"Always remember, beginning is the hardest part."}
{"fr":"Vous êtes fatigué ? Laissez le travail difficile aux grandes personnes.","en":"Oh you\'re tired ? Leave the hard work for the big boys."}
{"fr":"Les idées sont bon marché, les idées sont faciles, les idées sont courantes. Tout le monde a des idées, les idées sont très, très surévaluées. Seule l\'exécution compte.","en":"Ideas are cheap, ideas are easy, ideas are common. Everybody has ideas, ideas are higly, higly overvalued. Execution is all that matters."};Casey Neistat
{"fr":"Faites-le avec passion ou pas du tout.","en":"Do it with passion or not at all."};Rosa Nochette Carey
{"fr":"Seuls ceux qui prennent le risque d\'échouer spectaculairement réussiront brillamment.","en":"Only those who take the risk of failing spectacularly will succeed brilliantly."};Robert Francis Kennedy
{"fr":"C\'est lorsqu\'ils dont dos au mur que les grands joueurs se révèlent.","en":"It\'s when their backs are against the wall that the great players reveal themselves."}
{"fr":"Je veux voir ce qui se passe si je n\'abandonne pas.","en":"I want to see what happens if I don\'t give up."};Neila Rey
{"fr":"Nous sommes ce que nous faisons à plusieurs reprises. L\'excellence n\'est donc pas un acte mais une habitude.","en":"We are what we do over and over again. Excellence, then, is not an act but a habit."};Aristote
{"fr":"Hier, vous avez dit demain.","en":"Yesterday you said tomorrow."};Nike
{"fr":"La taille de votre public n\'a pas d\'importance. Continuez à faire du bon travail.","en":"The size of your audience doesn\'t matter. Keep up the good work."}
{"fr":"Si l\'on vous dit que vous ne pouvez pas le faire, faites-le deux fois et prenez des photos.","en":"When they say you can\'t do it, do it twice, and take pics."};Tami Xiang
{"fr":"Le plus drôle, c\'est que lorsque vous commencez à vous sentir heureux seul, c\'est à ce moment-là que tout le monde décide d\'être avec vous.","en":"The funny thing is when you start feeling happy alone, that\'s when everyone decides to be with you."};Jim Carrey
{"fr":"La qualité de vie d\'une personne est directement proportionnelle à son engagement en faveur de l\'excellence.","en":"The quality of a person\'s life is in direct proportion to their commitment to excellence."};Vince Lombardi
{"fr":"Vivez comme si vous viviez déjà pour la deuxième fois et comme si vous aviez agi la première fois aussi mal que vous êtes sur le point d\'agir maintenant.","en":"Live as if you were living already for the second time and as if you had acted the first time as wrongly as you are about to act now."};Viktor E. Frankl
{"fr":"La perfection n\'est pas accessible. Mais si nous poursuivons la perfection, nous pouvons atteindre l\'excellence.","en":"Perfection is not attainable. But if we chase perfection we can catch excellence."};Vince Lombardi
{"fr":"Nous sommes ici pour rire des aléas et vivre notre vie si bien que la mort tremblera de nous prendre.","en":"We are here to laugh at the odds and live our lives so well that death will tremble to take us."};Charles Bukowski
{"fr":"Si vous voulez bien paraître devant des milliers de personnes, vous devez surpasser des milliers de personnes seul.","en":"If you want to look good in front of thousands, you have to outwork thousands in front of nobody."};Damian Lillard
{"fr":"Faire plus que ce qui est attendu. C\'est cela la grandeur.","en":"Doing more than what\'s expected. That\'s greatness."}
{"fr":"Agissez aujourd\'hui comme si c\'était le jour où l\'on se souviendra de vous.","en":"Act today as if this the day you will be remembered."};Dr. Seuss
{"fr":"Celui qui gagne est celui qui fait tout ce qu\'il faut.","en":"The one who wins is the one who does whatever it takes."}
{"fr":"Allez-y à fond ou n\'y allez pas du tout.","en":"Go all out or don\'t go at all."}
{"fr":"Soyez quelqu\'un que personne ne pensait pouvoir être.","en":"Be somebody nobody thought you could be."}
{"fr":"Tout le monde peut en rêver. Montrez au monde que vous pouvez le faire.","en":"Anyone can dream it. Show the world you can do it."};Walt Disney
{"fr":"La régularité est ce qui transforme la moyenne en excellence.","en":"Consistency is what transforms average into excellence."};Tony Robins
{"fr":"Tout est possible. L\'impossible prend juste plus de temps.","en":"Everything is possible. The impossible just takes longer."};Dan Brown
{"fr":"Les plus grandes montagnes sont toujours escaladées de la même manière, un pas après l\'autre.","en":"The biggest moutains are always climbed the same way every time: one step at a time."}
{"fr":"Si vous ne pouvez pas les surpasser. Travaillez plus qu\'eux. ","en":"If you can\'t outplay them. Outwork them."};Ben Hogan
{"fr":"La grandeur consiste à exiger de soi plus que ce que les autres pourraient jamais exiger de soi. Quand les autres disent : \'terminé\', vous dites \'suivant\'.","en":"Greatness is demanding more of yourself than anyone else could ever demand of you. When others say : \'done\' you say \'next\'."}
{"fr":"Le moyen le plus sûr de réussir est d\'essayer encore une fois.","en":"The most certain way to succeed is to try one more time."};Thomas Edison
{"fr":"Tout ce qui vaut la peine d\'être fait vaut la peine d\'être mal fait. Jusqu\'à ce que vous le fassiez correctement.","en":"Anything worth doing is worth doing badly. Until you do it right."};Zig Ziglar
{"fr":"Vous êtes votre meilleur ami. Ne vous rabaissez jamais, jamais.","en":"You are your own best friend. Never, ever put yourself down."};Paulo Coelho
{"fr":"Ils disaient \'c\'est difficile\', j\'ai dit \'on y va quand même\'.","en":"They said \'it\'s difficult\', I said \'bring it on\'."}
{"fr":"Personne ne peut changer le monde sans avoir d\'obsession.","en":"No one can change the world without obsession."}
{"fr":"Trouvez des personnes qui sont meilleures que vous et jouez avec elles.","en":"Find people who are better than you and play with them."}
{"fr":"Vous est-il déjà arrivé de vous arrêter et de penser : \'Wow, j\'ai rêvé de cela, c\'est là, c\'est en train de se produire\'.","en":"Have you ever stopped and thought : \'Wow, I prayed for this, it\'s here, it\'s happening.\'"}
{"fr":"Ce qui compte, ce ne sont pas les cartes qui vous ont été distribuées. Ce qui compte, c\'est la façon dont vous jouez votre jeu.","en":"It\'s not about the cards you\'ve been dealt. It\'s how you play your hand."};Randy Pausch
{"fr":"De la chance, pour en avoir, il faut la provoquer.","en":"To be lucky, you have to provoke it."};Yoichi Hiruma
{"fr":"20 minutes passées à faire quelque chose ont plus de valeur que 20 heures passées à penser à faire quelque chose.","en":"20 minutes of doing something is more valuable than 20 hours of thinking about doing something."}
{"fr":"On ne peut pas rattraper le temps perdu, mais on peut arrêter de perdre son temps.","en":"You can\'t make up for lost time, but you can stop wasting time."};Jennifer Lawrence
{"fr":"Ce n\'est pas en suivant le rythme que je serais le meilleur.","en":"It\'s not by keeping up with the pace that I\'ll be the best."};Izuku Midoriya
{"fr":"Si cela vous rend heureux, allez-y. Ils parleront de vous de toute façon.","en":"If it makes you happy, go for it. They are gonna talk about you anyway."};Thomas Shelby
{"fr":"Être triste est une perte de temps, trouvez une raison de sourire.","en":"Being sad is a waste of time, find a reason to smile."};Mr Bean
{"fr":"Vous n\'aurez peut-être plus jamais cette chance. Faites en sorte qu\'elle compte.","en":"You might not ever get this chance again. Make it count."}
{"fr":"Si le jeu en vaut la chandelle, il faut se battre pour l\'obtenir.","en":"If it\'s worth it, fight for it. "}
{"fr":"Un homme sans ambition est comme un oiseau sans ailes.","en":"A man without ambition is like a bird without wings."}
{"fr":"Si la taille comptait, l\'éléphant serait le roi de la jungle.","en":"If size mattered, the elephant would be the king of the jungle. "}
{"fr":"Tombe sept fois, relève toi 8 fois.","en":"Fall seven times, stand up eight. "}
{"fr":"Donnez au monde une raison de se souvenir de votre nom.","en":"Give the world a reason to remember your name."}
{"fr":"Si vous n\'atteignez pas votre objectif, changez de stratégie, pas d\'objectif.","en":"If you don\'t reach your goal, change your strategy, not your goal."}
{"fr":"Entraînez votre esprit à rester calme dans toutes les situations.","en":"Train your mind to be calm in every situation. "}
{"fr":"Ce qui compte, ce ne sont pas les cartes qui vous ont été distribuées. Ce qui compte, c\'est la façon dont vous jouez votre jeu.","en":"It\'s not about the cards you\'ve been dealt. It\'s how you play your hand. "}
{"fr":"Ce que vous faites quand personne ne vous regarde détermine qui vous êtes vraiment.","en":"What you do when no one is watching determines who you really are. "}
{"fr":"On ne peut pas toujours être fort, mais on peut toujours être courageux et discipliné.","en":"You can not always be strong but you can always be brave and disciplined. "}
{"fr":"On va se casser la gueule, douiller et tomber. Mais après, on va se relever, on va se battre et y arriver. ","en":"We\'re going to crash and burn and fall. But afterwards, we\'ll get up, we\'ll fight and we\'ll make it."}
{"fr":"Il y a des jours où il est difficile de trouver la motivation et d\'autres où la motivation vous trouve !","en":"Some days it\'s hartd to find motivation and some days motivation finds you !"}
{"fr":"Travaillez maintenant. Cela portera ses fruits plus tard.","en":"Work for it now. It will pay off later. "}
{"fr":"La compétence la plus essentielle dans la vie, c\'est la tenacité, la capacité à ne jamais lâcher, peu importe l\'obstacle se trouvant en face de toi. ","en":"The most essential skill in life is tenacity, the ability to never give up, no matter what obstacle is in front of you."}
{"fr":"Rappelez-vous que la majeure partie de votre stress provient de la façon dont vous réagissez, et non de ce qui vous arrive. Modifiez votre attitude et voyez votre vie changer.","en":"Remember, most of your stress comes from the way you respond, not what actually happens to you. Adjut your attitude and watch your life change. "}
{"fr":"Chaque étape suivante de votre vie exigera une version différente de vous.","en":"Every next level of your life will demande a different version of you. "}
{"fr":"Peu importe comment vous vous sentez, levez-vous, habillez-vous, montrez-vous et n\'abandonnez jamais.","en":"No matter how you feel, get up, dress up, show up and never give up. "}
{"fr":"Lorsque vous apprenez de nouvelles compétences, réfléchissez à la manière dont vous pouvez apprendre les bases rapidement et les appliquer ensuite à un projet sur lequel vous pouvez travailler. N\'essayez pas d\'apprendre tout ce que vous pouvez en une seule fois. Procédez étape par étape.","en":"When learning new skills, think about how you can learn the basics fast and then apply it to a project you can work on. Don\'t try to learn everything you can at once. Take it step by step. "};Kyle McKiou
{"fr":"Difficile ne signifie pas impossible. Cela signifie simplement qu\'il faut travailler dur.","en":"Difficult doesn\'t mean impossible. It simply means that you have to work hard. "}
{"fr":"Merci pour la douleur, cela m\'a permis d\'élever mon niveau de jeu.","en":"Thank you for the pain, it made me raise my game. "}
{"fr":"Traitez-moi de fou, mais j\'aime voir les gens heureux et réussir. La vie est un voyage, pas une compétition.","en":"Call me crazy but I love to see people happy & succeeding. Life is a journey, not a competition. "}
{"fr":"Parfois, la vie consiste à tout risquer pour réaliser un rêve que personne d\'autre que vous ne peut voir.","en":"Sometimes life is about risking everything for a dream no one can see but you. "}
{"fr":"Tout dans votre vie est le reflet d\'un choix que vous avez fait. Si vous voulez un résultat différent, faites un choix différent.","en":"Everything in your life is a reflection of a choice you have made. If you want a different result, make a different choice. "}
{"fr":"Personne ne peut changer le monde sans avoir d\'obsession. ","en":"No one can change the world without obsession."}
{"fr":"Ne vous comparez pas aux autres. C\'est alors que vous commencez à perdre confiance en vous.","en":"Don\'t compare yourself to others. That\'s when you start to lose confidence in yourself."};Will Smith
{"fr":"Tout ce que vous pouvez faire est tout ce que vous pouvez faire. Mais tout ce que vous pouvez faire est suffisant.","en":"All you can do is all you can do. But all you can do is enough. "}
{"fr":"Les erreurs sont la preuve que vous essayez.","en":"Mistakes are proof that you are trying. "}
{"fr":"Ce que vous devenez au cours du voyage est plus important que le rêve.","en":"What you become in the process is more important than the dream. "}
{"fr":"Le moyen le plus sûr de réussir est d\'essayer encore une fois.","en":"The most certain way to succeed is to try one more time. "}
{"fr":"Oublier d\'essayer. Oubliez les tentatives. Faites-le. Faites-le jusqu\'au bout.","en":"Forget about trying. Forget about giving it a shot. Just do. Do it all the way. "}
{"fr":"Tout le monde peut commencer quelque chose. Très peu de personnes peuvent terminer.","en":"Anyone can start something. Very few people can finish. "}
{"fr":"Personne ne le fera à votre place. C\'est à vous de travailler. Chaque jour. Que vous en ayez envie ou non.","en":"No one is going to do it for you. You have to be the one to put in the work. Every single day. Whether you feel like it or not. "}
{"fr":"Un pessimiste voit la difficulté dans chaque opportunité. Un optimiste voit l\'opportunité dans chaque difficulté.","en":"A pessimist sees the difficulty in every opportunity. An optimist sees the opportunity in every difficulty. "}
{"fr":"Ce que vous faites, c\'est ce que vous priorisez. Si c\'est suffisamment important pour vous, vous y parviendrez.","en":"What you get done is what you prioritize. If it\'s important enough to you, you\'ll make it happen. "}
{"fr":"Ne comptez pas les jours. Faites en sorte que les jours comptent.","en":"Don\'t count the days. Make the days count. "}
{"fr":"Vous devez non seulement viser juste, mais aussi tirer l\'arc de toutes vos forces.","en":"You must not only aim right, but draw the bow with all your might. "}
{"fr":"Ce n\'est pas le fait de vouloir gagner qui fait de vous un gagnant. C\'est le refus de l\'échec.","en":"It\'s not wanting to win that makes you a winner. It\'s refusing to fail. "}
{"fr":"Les champions continuent à jouer jusqu\'à ce qu\'ils réussissent.","en":"Champions keep playing until they get it right. "}
{"fr":"Aujourd\'hui est le jour le plus important de votre vie. Faites en sorte que chaque seconde compte.","en":"Today is the most important day of your life. Make every second count. "}
{"fr":"La régularité est ce qui transforme la moyenne en excellence.","en":"Consistency is what transforms average into excellence. "}
{"fr":"Faites ce que vous devez faire jusqu\'à ce que vous puissiez faire ce que vous voulez.","en":"Do what you have to until you can do what you want to. "}
{"fr":"Parfois, il n\'y a pas de prochaine fois. Parfois, c\'est maintenant ou jamais.","en":"Sometimes there is no next time. Sometimes it\'s now or never. "}
{"fr":"Les bonnes choses arrivent à ceux qui travaillent pour cela.","en":"Good things come to those who work for it. "}
{"fr":"Poursuivez vos rêves comme si votre vie en dépendait. Parce que c\'est le cas.","en":"Go after your dreams like you life depends on it. Because it does. "}
{"fr":"Faites ce qui est facile, la vie sera difficile. Faites ce qui est difficile, la vie sera facile.","en":"Do what is easy, life will be hard. Do what is hard, life will be easy. "}
{"fr":"Tout le monde peut en rêver. Montrez au monde que vous pouvez le faire.","en":"Anyone can dream it. Show the world you can do it. "}
{"fr":"Faites quelque chose aujourd\'hui dont votre futur vous remerciera.","en":"Do something today your future self will thank you for. "}
{"fr":"Le meilleur projet sur lequel vous travaillerez, c\'est vous.","en":"The best project you\'ll ever work on is you. "}
{"fr":"Plus on transpire à l\'entraînement, moins on saigne au combat.","en":"The more you sweat in training, the less you bleed in battle. "}
{"fr":"Allez-y à fond ou n\'y allez pas du tout.","en":"Go all out or don\'t go at all. "}
{"fr":"L\'échec est une réussite en devenir.","en":"Failure is success in progress. "}
{"fr":"Celui qui gagne est celui qui fait tout ce qui est nécessaire.","en":"The one who wins is the one who does whatever it takes. "}
{"fr":"Ceux qui se trouvent au sommet de la montagne n\'y sont pas tombés par hasard.","en":"Those on top of the moutain didn\'t fall there. "}
{"fr":"Les gagnants sont des personnes ordinaires dotées d\'une détermination extraordinaire.","en":"Winners are ordinary people with extraordinary determination. "}
{"fr":"Ne leur dites pas. Montrez-leur.","en":"Don\'t tell them. Show them. "}
{"fr":"Celui qui est tombé et s\'est relevé est beaucoup plus fort que celui qui n\'est jamais tombé.","en":"The one who has fallen and risen is much stronger than the one who never did. "}
{"fr":"Faites ce qui est juste, pas ce qui est facile.","en":"Do what is right, not what is easy. "}
{"fr":"S\'il cela vous met pas au défi, cela ne vous changera pas.","en":"If it doesn\'t challenge you it doesn\'t change you. "}
{"fr":"Il n\'est pas nécessaire de voir tout l\'escalier. Il suffit de faire la première marche.","en":"You don\'t have to see the whole staircase. Just take the first step. "}
{"fr":"Plus on travaille dur, plus il est difficile de s\'arrêter.","en":"The harder you work, the harder it is to surrender. "}
{"fr":"Tant que vous respirez, vous avez une nouvelle chance d\'essayer.","en":"As long as you\'re breathing, you have another chance to try again. "}
{"fr":"Regardez dans le miroir, c\'est votre compétition.","en":"Look in the mirror, that\'s your competition. "}
{"fr":"Cela semble toujours impossible jusqu\'à ce que ce soit fait.","en":"It always seems impossible until it\'s done. "}
{"fr":"Vous êtes le seul à pouvoir changer votre vie. Personne ne le fera à votre place.","en":"You\'re the only one who can change your life. No one will do it for you. "}
{"fr":"Tous les sommets peuvent être atteints si l\'on continue de grimper.","en":"Every summit can be reached if you just keep climbing. "}
{"fr":"Faire plus que ce qui est attendu, c\'est la grandeur.","en":"Doing more than what\'s expected, that\'s greatness. "}
{"fr":"Ça sera très dur de le faire, mais ça sera encore plus dur de ne pas l\'avoir fait. ","en":"It will hurt like hell doing it. But it will hurt much more to not do it at all. "}
{"fr":"Le plus grand projet sur lequel vous travaillerez jamais, c\'est vous.","en":"The greatest project you\'ll ever work on is you. "}
{"fr":"L\'expérience est simplement le nom que nous donnons à nos erreurs.","en":"Experience is simply the name we give our mistakes. "}
{"fr":"La vie ne consiste pas à attendre que l\'orage passe, mais à danser sous la pluie.","en":"Life isn\'t about waiting for the storm to pass, it\'s about dancing in the rain. "}
{"fr":"Les distractions sont les tueurs à petit feu de votre rêve. Ne les laissez pas vous en priver.","en":"Distractions are the slow killers of your dream. Don\'t let them take it from you. "}
{"fr":"Le monde ne vous doit rien, c\'est vous qui vous devez quelque chose. Si vous le voulez, mettez-vous au travail.","en":"The world doesn\'t owe you anything, you owe yourself. If you want it, get to work. "}
{"fr":"L\'effort continu, et non la force ou l\'intelligence. est la clé pour libérer notre potentiel.","en":"Continuous effort, not strength or intelligence. Is the key to unlocking our potential. "}
{"fr":"La discipline est la passerelle entre les objectifs et les réalisations.","en":"Discipline is the bridge between goals and accomplishment. "}
{"fr":"Une grande vie ne se fait pas en une seule action gigantesque. C\'est chaque petite action bien menée. Encore et encore. Chaque jour.","en":"A great life isn\'t made in one giant action. It\'s every single tiny action done well. Over and over. Every single day. "}
{"fr":"Obsédé est un mot que les paresseux utilisent pour décrire les passionnés.","en":"Obsessed is a word that the lazy use to describe the dedicated. "}
{"fr":"La perfection n\'est pas accessible. Mais si nous poursuivons la perfection, nous pouvons atteindre l\'excellence.","en":"Perfection is not attainable. But if we chase perfection we can catch excellence. "}
{"fr":"Vous ne changerez jamais votre vie tant que vous ne changerez pas quelque chose que vous faites tous les jours. Le secret de votre réussite se trouve dans votre routine quotidienne.","en":"You\'ll never change your life until you change something you do daily. The secret of you success is found in your daily routine. "}
{"fr":"La qualité de vie d\'une personne est directement proportionnelle à son engagement en faveur de l\'excellence.","en":"The quality of a person\'s life is in direct proportion to their commitment to excellence. "}
{"fr":"Ceux qui obtiennent ce qu\'ils veulent ne sont pas seulement intéressés. Ils s\'y impliqué à 100%.","en":"Those who get what they want aren\'t just interested in it. They\'re committed to it. "}
{"fr":"La plupart des choses importantes dans le monde ont été accomplies par des personnes qui ont continué à essayer quand il semblait n\'y avoir aucun espoir.","en":"Most of the important things in the world have been accomplished by people who kept trying when there seemed to be no hope."};Dale Carnegie
{"fr":"Ce n\'est pas fini tant que je n\'ai pas gagné.","en":"It\'s not over until I win. "}
{"fr":"Il faut apprendre à son esprit à être plus fort que ses sentiments, sinon on se perd.","en":"You have to train your mind to be stronger than your feelings or else you gonna lose yourself. "}
{"fr":"Rappel : Ne vous laissez pas submerger. Attaquez un problème à la fois, soyez intentionnel et présent, restez simple.","en":"Reminder: Don\'t overwhelm yourself. Attack one problem at a time, be intentional and present, keep it simple. "}
{"fr":"Lorsque vous êtes crevé, dites-vous \'C\'est à ce moment là qu\'on reconnait les gagnants\'. ","en":"When your body gets tired, say this : \'This is where winners are made.\'"}
{"fr":"Si perdre ne faisait pas si mal, gagner ne serait pas si bon. ","en":"If losing wasn\'t so bad, winning wouldn\'t be so good."}
{"fr":"Le moment où vous voulez tout abandonner est précisément le moment où vous devez maintenir vos efforts et vous battre. ","en":"The moment when you want to give it all up is precisely the moment when you need to maintain your efforts and fight."};Frank Nicolas
{"fr":"L\'autodiscipline commence par la maîtrise de ses pensées. Si vous ne contrôlez pas ce que vous pensez, vous ne pouvez pas contrôler ce que vous faites.","en":"Self-discipline begins with the mastery of your thoughts. If you don\'t control what you think, you can\'t control what you do. "}
{"fr":"Certaines personnes vous détesteront simplement parce qu\'elles vous voient obtenir le succès qu\'elles pensent mériter grâce au travail qu\'elles n\'ont pas accompli.","en":"Some people will hate you just because they see you getting the success they think they deserve from the work they haven\'t done. "}
{"fr":"Un homme réussit s\'il se lève le matin et se couche le soir, et entre-temps, fait tout ce qu\'il veut.","en":"A man is a success if he gets up in the morning and gets to bed at night, and in between he does what he wants to do."};Bob Dylan
{"fr":"Si vous saviez que vous ne pouvez jamais échouer dans quoi que ce soit, qu\'essaieriez-vous ?","en":"If you knew you could never fail at anything, what would you try ?"}
{"fr":"Je veux voir ce qui se passe si je n\'abandonne pas.","en":"I want to see what happens if I don\'t give up."}
{"fr":"Faites-le avec passion ou pas du tout.","en":"Do it with passion or not at all. "}
{"fr":"Toute stratégie de succès doit intégrer l\'échec. ","en":"Any strategy for success must include failure."}
{"fr":"La discipline consiste à choisir ce que l\'on veut le PLUS plutôt que ce que l\'on veut MAINTENANT.","en":"Discipline is choosing what you want MOST over what you want NOW. "}
{"fr":"Prenez des risques : si vous gagnez, vous serez heureux, si vous perdez, vous serez sage.","en":"Take risks: if you win, you will be happy, if you lose, you will be wise. "}
{"fr":"Ne comparez pas votre chapitre 1 au chapitre 20 de quelqu\'un d\'autre.","en":"Don\'t compare your chapter 1 to someone else\'s chapter 20."}
{"fr":"Ne comparez pas votre niveau 1 au niveau 20 de quelqu\'un d\'autre.","en":"Don\'t compare your level 1 to someone else\'s level 20. "}
{"fr":"Je n\'ai pas peur, je suis né pour gagner.","en":"I\'m not afraid, I was born to win. "}
{"fr":"Avez-vous vraiment passé une mauvaise journée ou avez-vous eu 10 à 20 minutes pendant lesquelles vous avez laissé vos pensées se dérouler de manière indisciplinée et cela vous a conduit à une mauvaise ambiance que vous avez laissée vous emporter ? Allez... C\'est vous qui dirigez cette merde, faites attention.","en":"Did you really have a bad day or did you have 10-20 minutes where you let your thoughts run undisciplined and it led you to a bad vibe that you let carry you away ? Come on.. You run this shit, pay attention. "}
{"fr":"Si tout semble sous contrôle, c\'est que vous n\'allez pas assez vite. ","en":"If everything seems under control, you\'re not moving fast enough."}
{"fr":"Je n\'aime pas étudier, je déteste étudier. J\'aime apprendre, apprendre c\'est magnifique.","en":"I don\'t love studying, I hate studying. I like learning, learning is beautiful."};Natalie Portman
{"fr":"Travaillez si dur que vous oubliez quel jour il est.","en":"Work so hard that you forget what day it is. "}
{"fr":"Il n\'y a qu\'une seule réussite : arriver à vivre sa vie comme on l\'entend. ","en":"There\'s only one success: living your life the way you want to."}
{"fr":"Impossible veut simplement dire que vous n\'avez pas encore trouvé la solution. ","en":"Impossible simply means that you haven\'t found the solution yet."}
{"fr":"Si vous ne courrez pas après ce que vous voulez, vous ne l\'aurez jamais. Si vous ne demandez pas, la réponse sera toujours non. Si vous ne faites pas un pas en avant, vous rester toujours au même endroit. ","en":"If you don\'t chase what you want, you\'ll never get it. If you don\'t ask, the answer will always be no. If you don\'t take a step forward, you\'ll always stay in the same place."};Nora Roberts 
{"fr":"Une idée fixe aboutit à la folie ou à l\'héroïsme.","en":"A fixed idea leads to madness or heroism."}
{"fr":"Un optimiste sait qu\'il n\'est pas à l\'abri des tempêtes, mais il est convaincu qu\'aucune tempête ne pourra le submerger. ","en":"An optimist knows that he\'s not immune to storms, but he\'s convinced that no storm can overwhelm him."}
{"fr":"Vous allez énerver beaucoup de monde lorsque vous commencerez à faire ce qui est le mieux pour vous.","en":"You are gonna piss a lot of people when you start doing what\'s best for you. "}
{"fr":"Cessez d\'avoir peur de ce qui pourrait mal tourner et commencez à vous réjouir de ce qui pourrait bien se passer.","en":"Stop being afraid of what could go wrong and start being excited of what could go right. "}
{"fr":"Ils ne savaient pas que c\'était impossible, alors ils l\'ont fait !","en":"They didn\'t know it was impossible, so they did it!"}
{"fr":"L\'humanité se divise en trois catégories, ceux qui ne peuvent pas bouger, ceux qui peuvent bouger, et ceux qui bougent. ","en":"Humanity is divided into three categories: those who can\'t move, those who can, and those who do."};Benjamin Franklin
{"fr":"L\'entrainement bat le talent quand le talent ne s\'entraine pas. ","en":"Training beats talent when talent doesn\'t train."}
{"fr":"Si vous n\'arrêtez pas d\'y penser, ne cessez jamais d\'y travailler.","en":"If you can\'t stop thinking about it, never stop working on it. "}
{"fr":"Vous allez faire des erreurs, mais c\'est ok, c\'est même plutôt parfait !","en":"You\'ll make mistakes, but it\'s okay - in fact, it\'s quite perfect!"}
{"fr":"Croire en soi, c\'est le premier pas vers la réussite. ","en":"Believing in yourself is the first step towards success."}
{"fr":"La meilleure préparation pour demain est de faire de son mieux aujourd\'hui.","en":"The best preparation for tomorrow is doing your best today. "}
{"fr":"Sang, sueur et respect. Les deux premiers vous les donnez, le dernier vous le gagnez. ","en":"Blood, sweat and respect. The first two you give, the last you earn."}
{"fr":"Entraînez-vous comme si vous n\'aviez jamais gagné. Jouez comme si vous n\'aviez jamais perdu.","en":"Practice like you\'ve never won. Perform like you\'ve never lost. "}
{"fr":"Je ne suis pas en train de te dire que ça va être facile, je te dis juste que ça en vaut la peine. ","en":"I\'m not saying it\'s going to be easy, I\'m just saying it\'ll be worth it."}
{"fr":"Nous sommes ce que nous faisons à plusieurs reprises. L\'excellence n\'est donc pas un acte, mais une habitude. ","en":"We are what we do over and over again. Excellence is not an act, but a habit."}
{"fr":"Avec de la discipline, tu peux réaliser l\'impossible. ","en":"With discipline, you can achieve the impossible."}
{"fr":"Chaque professionnel était autrefois un amateur, et chaque maître a commencé en tant que débutant. Les gens ordinaires peuvent accomplir des exploits extraordinaires une fois qu\'ils ont mis au point les bonnes habitudes. ","en":"Every expert was once an amateur, and every master began as a beginner. Ordinary people can achieve extraordinary things once they\'ve developed the right habits."};Robin Sharma
{"fr":"L\'échec est juste une opportunité de recommencer plus intelligemment. ","en":"Failure is just an opportunity to start again more intelligently."}
{"fr":"Si vous vous attendez à ce que le monde soit juste envers vous parce que vous êtes juste, vous vous trompez vous-même. C\'est comme si vous attendiez d\'un lion qu\'il ne vous mange pas parce que vous ne l\'avez pas mangé.","en":"If you expect the world to be fair to you because you are fair, you\'re fooling youself. That\'s like expecting a lion not to eat you because you didn\'t eat him. "}
{"fr":"On échoue plus souvent par timidité que par excès d\'audace.","en":"We fail more often out of timidity than out of boldness."};David Grayson
{"fr":"Le succès semble difficile à atteindre jusqu\'au jour où vous comprenez cette règle : le premier produit que vous devez vendre, c\'est vous. Le reste viens tout seul. ","en":"Success seems hard to achieve until you understand this rule: the first product you have to sell is yourself. The rest is up to you."}
{"fr":"Plus le combat est difficile, plus la victoire est belle. ","en":"The more difficult the battle, the greater the victory."}
{"fr":"Tu n\'atteindras pas ton vrai potentiel tant que tu ne te lances pas le défi d\'aller plus loin que les limites que tu t\'es imposé. ","en":"You won\'t reach your true potential until you challenge yourself to go beyond your self-imposed limits."}
{"fr":"Bien sûr que c\'est difficile, c\'est censé l\'être. Si c\'était facile, tout le monde le ferait.","en":"Of course it\'s hard, it\'s supposed to be hard. If it was easy everyone would do it. "}
{"fr":"Ne crains pas l\'échec. Ce n\'est pas l\'échec mais le manque d\'ambition qui est un crime. Avec des objectifs élevés, l\'échec peut être glorieux.","en":"Don\'t be afraid of failure. It\'s not failure but lack of ambition that\'s a crime. With high goals, failure can be glorious."};Bruce Lee
{"fr":"Le secret de la réussite se cache dans votre routine quotidienne.","en":"The secret to success is hidden in your daily routine."}
{"fr":"Avoir une vision claire de son objectif permet d\'y parvenir plus facilement. ","en":"Having a clear vision of your goal makes it easier to achieve."}
{"fr":"L\'homme a besoin de ce qu\'il y a de pire en lui s\'il veut parvenir à ce qu\'il a de meilleur. ","en":"Man needs the worst in himself if he is to achieve the best."};Friedrich Nietzsche
{"fr":"On me considère toujours comme l\'outsider avant de voir mon niveau. ","en":"People always think of me as the outsider before they see my level."}
{"fr":"Il faut quotidiennement faire au moins un geste vers l\'accomplissement de vos rêves ! ","en":"Every day, you have to take at least one step towards fulfilling your dreams!"}
{"fr":"Rêvez, car c\'est avec des rêves, des projets, des envies, que l\'on avance constamment. ","en":"Dream, because it\'s with dreams, projects and desires that we constantly move forward."};Aurélien Ducroz
{"fr":"Si tu traverses l\'enfer, ne t\'arrête pas.","en":"If you\'re going through hell, don\'t stop."};Winston Churchill
{"fr":"Si vous n\'y allez pas à fond, à quoi bon y aller ? ","en":"If you don\'t go all out, what\'s the point?"};Joe Namath
{"fr":"Lorsqu\'il y a de la passion, la motivation est présente. ","en":"When there\'s passion, there\'s motivation."};Michael Schumacher
{"fr":"C\'est justement la possibilité de réaliser un rêve qui rend la vie intéressante. ","en":"It\'s the possibility of realizing a dream that makes life interesting."};Paulo Coehlo
{"fr":"Être un gagnant n\'est pas le fruit du hasard. C\'est la répétition d\'habitudes quotidiennes. ","en":"Being a winner doesn\'t just happen. It\'s the repetition of daily habits."}
{"fr":"Les jeux vidéos m\'ont appris un truc. Lorsque tu rencontres des ennemis, c\'est que t\'es sur le bon chemin. ","en":"Video games have taught me one thing. When you meet enemies, it means you\'re on the right path."}
{"fr":"Si tu travailles sur quelque chose qui a réellement de l\'importance pour toi, tu n\'as pas besoin d\'être poussé, la vision te tire déjà. ","en":"If you\'re working on something that really matters to you, you don\'t need to be pushed, the vision is already pulling you along."};Steve Jobs
{"fr":"Si tu penses ne pas pouvoir faire quelque chose, fais-le quand même. Ca s\'appelle dépasser sa zone de confort, c\'est là que se trouvent les miracles. ","en":"If you think you can\'t do something, do it anyway. It\'s called going beyond your comfort zone, and that\'s where miracles are."}
{"fr":"Ne vous entraînez pas jusqu\'à ce que vous réussissiez, mais jusqu\'à ce que vous ne puissiez plus vous tromper.","en":"Don\'t practice until you get it right, practice until you can\'t get it wrong. "}
{"fr":"La volonté de gagner, le désir de réussir, et l\'envie d\'atteindre votre plein potentiel.. Ce sont là les clés qui vont ouvrir la porte à l\'excellence personnelle.","en":"The will to win, the desire to succeed, and the drive to reach your full potential... These are the keys that will open the door to personal excellence."};Confusius
{"fr":"Les individus qui réussissent sont ceux qui savent mobiliser toutes leurs ressources mentales et physiques sur un objectif.","en":"Successful individuals are those who know how to mobilize all their mental and physical resources towards a goal."};Anthony Robbins
{"fr":"Lorsque vous travaillez avec des personnes que vous appréciez et que vous admirez parce qu\'elles sont excellentes dans ce qu\'elles font, vous n\'avez pas l\'impression de travailler, c\'est comme si vous jouiez.","en":"When you work with people whom you like and you admire because they\'re so good at what they do, it doesn\'t feel like work, it\'s like your playing. "};Stan Lee
{"fr":"Même si cela ne marche pas, tu n\'aurais jamais su ce que cela aurait pu donner. Alors repose toi et recommence, l\'échec n\'existe pas tant que tu essayes. ","en":"Even if it doesn\'t work, you\'d never know what it could have done. So sit back and try again, there\'s no such thing as failure as long as you keep trying."}
{"fr":"Il est de très loin plus lucratif et amusant de capitaliser sur vos points forts que d\'essayer de corriger tous vos points faibles.","en":"It\'s far more lucrative and fun to capitalize on your strengths than to try and correct all your weaknesses."};Tim Ferriss
{"fr":"Mon père avait l\'habitude de dire : \'Quoi que tu fasses, fais-le à cent pour cent. Quand tu travailles, travaille, quand tu ris, ris, quand tu manges, mange comme si c\'était ton dernier repas.\'","en":"My father used to say, whatever you do, do it hundred percent. When you work, work, when you laugh, laugh, when you eat, eat like it\'s your last meal."}
{"fr":"Gardez la foi, les choses les plus surprenantes de la vie ont tendance à se produire au moment où vous êtes sur le point de perdre espoir. ","en":"Keep the faith, the most surprising things in life tend to happen just when you\'re about to lose hope."}
{"fr":"Lorsque votre esprit vous dit que vous avez terminé, que vous êtes épuisé, que vous ne pouvez pas aller plus loin, vous n\'êtes en réalité qu\'à 40 %.","en":"When you mind is telling you that you\'re done, that you\'re exhausted, that you cannot possibly go any further, you\'re only actually 40% done."};David Goggins
{"fr":"Ce qui te rend étrange est probablement ton plus grand atout. ","en":"What makes you strange is probably your greatest strength."}
{"fr":"La compétence numéro un dans la vie est celle de ne pas abandonner.","en":"The number one skill in life is not giving up. "}
{"fr":"Si vous ne commencez pas aujourd\'hui, pourquoi pensez-vous que vous commencerez demain ?","en":"If you don\'t start today, then what the hell makes you think you\'ll start tomorrow?"}
{"fr":"Tu peux, tu devrais, et si tu es assez courageux pour commencer, tu le feras. ","en":"You can, you should, and if you\'re brave enough to start, you will."}
{"fr":"La grandeur, c\'est beaucoup de petites choses bien faites tous les jours. ","en":"Greatness is a lot of little things done right every day."}
{"fr":"Ce n\'est pas le vent qui décide de votre destination, c\'est l\'orientation que vous donnez à votre voile. Le vent est pareil pour tous.","en":"It\'s not the wind that decides your destination, it\'s the direction you set your sail. The wind is the same for everyone."};Jim Rohn
{"fr":"Votre muscle le plus fort et votre pire ennemi est votre esprit. Entraînez-le bien.","en":"Your strongest muscle and worst enemy is your mind. Train it well. "}
{"fr":"Mais c\'est précisément lorsque l\'on se croit en sécurité que l\'on est le plus vulnérable.","en":"But when you think you\'re safe is precisely when you\'re most vulnerable."};Seven Samourai
{"fr":"Commencez maintenant, pas demain, Demain, c\'est une excuse de perdant. ","en":"Start now, not tomorrow, Tomorrow is a loser\'s excuse."};Andrew Fashion
{"fr":"Si vous ne jouez pas pour gagner, ne jouez pas du tout.","en":"If you don\'t play to win, don\'t play at all. "}
{"fr":"Plus tu te plantes, plus ta probabilité de réussir par le travail est élevée. ","en":"The more you screw up, the higher your probability of succeeding through work."}
{"fr":"On n\'arrive pas au sommet en dépassant les autres, mais en se dépassant soi-même. ","en":"You don\'t get to the top by surpassing others, but by surpassing yourself."}
{"fr":"Ce n\'est jamais plus facile, on devient juste plus fort.","en":"It never gets easier, you just get stronger. "}
{"fr":"Il n\'y a pas de gloire dans la pratique, mais sans pratique, il n\'y a pas de gloire.","en":"There is no glory in practice, but without practice there is no glory. "}
{"fr":"L\'argent est un mauvais maître mais un excellent serviteur.","en":"Money is a terrible master but an excellent servant."}
{"fr":"Les problèmes sont le prix à payer pour le progrès.","en":"Problems are the price you pay for the progress. "}
{"fr":"La plupart des gens font évoluer leur personnage dans les jeux vidéos, rares sont ceux qui le font dans la vraie vie. ","en":"Most people develop their characters in video games, but very few in real life."}
{"fr":"Lorsque vous vous concentrez sur vous, vous vous développez. Quand on se concentre sur la merde, la merde grandit.","en":"When you focus on you, you grow. When you focus on shit, shit grows."}
{"fr":"Pour avoir du temps, il faut une organisation saine et non contraingnante, au risque d\'abandonner rapidement.","en":"To have time, you need to be organised in a way that is healthy and not restrictive, otherwise you risk giving up quickly."}
{"fr":"To have time, you need a healthy organization that doesn\'t restrict you, or you risk giving up quickly.","en":"You don\'t have to be perfect. All you have do to is show up and enjoy this messy, imperfect, and beautiful journey of life. "}
{"fr":"Vous devenez maître de la vie lorsque vous apprenez à contrôler l\'utilisation de votre temps et de votre attention. Valorisez ce à quoi vous consacrez votre temps et votre énergie.","en":"You become a master of life when you learn how to controle where your time and attention goes. Value what you give you time and energy to. "}
{"fr":"Les temps difficiles ne durent pas, ce sont les gens difficiles qui durent.","en":"Tough times don\'t last, tough people do. "}
{"fr":"Pour réussir, il n\'est pas nécessaire d\'avoir un beau visage et un corps héroïque, ce qu\'il faut, c\'est un esprit habile et une capacité de réalisation.","en":"To be successfull, you don\'t need a beautiful face & heroic body, what you need is a skillful mind ability to perform. "};Roman Atkinson
{"fr":"Ne souhaitez pas avoir moins de problèmes, souhaitez avoir plus de compétences","en":"Don\'t want fewer problems, want more skills"};Jim Rohn
{"fr":"Ne choisissez pas un objectif en fonction de son attractivité. Choisissez un objectif en fonction de votre volonté d\'endurer le processus nécessaire pour l\'atteindre.","en":"Don\'t choose a goal based on how attrative the outcome is. Choose a goal based on how willing you are to endure the process required to achieve it. "}
{"fr":"Nous disposons tous des mêmes 24 heures par jour. Dire que vous n\'avez pas le temps n\'est pas une excuse, choisissez soigneusement vos priorités et faites-les passer en premier.","en":"We all have the same 24 hours in a day, saying that you have no time is not an excuse, choose your priorities carefully and put them first. "}
{"fr":"Il n\'y a pas d\'échec, que des personnes qui abandonnent.","en":"There are no failures, only quitters. "}
{"fr":"La préparation élimine la peur, peu importe le domaine. ","en":"Preparation eliminates fear, whatever the field."}
{"fr":"Si nous attendons d\'être prêts, nous attendrons toute notre vie.","en":"If we wait until we\'re ready, we\'ll be waiting for the rest of our lives. "}
{"fr":"L\'ascension est difficile mais le point de vue au sommet en vaut la peine. ","en":"It\'s a tough climb, but the view from the top is well worth it."}
{"fr":"On ne peut pas, sous prétexte qu\'il est impossible de tout faire en un jour, ne rien faire du tout. ","en":"Just because it\'s impossible to do everything in one day doesn\'t mean we can\'t do anything at all."}
{"fr":"Pour être le numéro 1, il faut s\'entraîner comme le numéro 2.","en":"To be number 1, train like number 2."}
{"fr":"L\'état d\'esprit est primordial.","en":"Mindset is everything. "}
{"fr":"Cela peut prendre plus de temps que prévu, mais la récompense sera au-delà de ce que vous imaginez.","en":"It might take longer than you expect but the reward will be beyond what you imagine. "}
{"fr":"Si vous placez la barre extrêmement haut et que vous ratez, votre échec sera supérieur aux succès des autres.","en":"If you set the bar extremely high and fail, your failure will outweigh the success of others."}
{"fr":"Gardez le silence jusqu\'à ce que vous sachiez que c\'est définitif.","en":"Keep it private till you know it\'s permanent. "}
{"fr":"La réussite ne tombe pas du ciel !","en":"Success doesn\'t just fall from the sky!"}
{"fr":"L\'action est la clé fondamentale de tout succès. ","en":"Action is the fundamental key to success."}
{"fr":"Changez les règles du jeu.","en":"Be a game changer. "}
{"fr":"Mon histoire n\'est pas terminée tant que je n\'ai pas gagné.","en":"My story is not over until I win. "}
{"fr":"Quand on comprend le jeu, on ne panique pas.","en":"When you understand the game, you don\'t panic. "}
{"fr":"Une fois que vous savez ce que vous voulez faire dans la vie, le monde devient votre bibliothèque. Tout ce que vous voyez, de cette perspective, fait de tout un atout d\'apprentissage pour vous.","en":"Once you know what it is in life that you want to do, then the world basically your library. Everything you view, from that perspective, which makes everything a learning asset for you. "};Kobe Bryant
{"fr":"Ne vous concentrez pas sur le passage de 0 à 100. Concentrez-vous sur le passage de 0 à 10. Puis de 10 à 20. Et ainsi de suite jusqu\'à ce que vous atteigniez 100. Créez des habitudes durables en progressant graduellement.","en":"Don\'t focus on going 0 to 100. Focus on going 0 to 10. Then 10 to 20. And so on until you get to 100. Build sustainable habits through gradual progression."}
{"fr":"Concentrez-vous sur ce que vous voulez, tout le reste n\'est qu\'une distraction.","en":"Focus on what you want, everything else is a distraction. "}
{"fr":"La douleur est un cadeau. Au lieu de l\'éviter, apprenez à l\'accueillir. Sans douleur, il n\'y a pas de croissance.","en":"Pain is a gift. Instead of avoiding it, learn to embrace it. Without pain there is no growth. "}
{"fr":"N\'abandonnez pas, les batailles les plus difficiles sont livrées aux soldats les plus forts.","en":"Don\'t give up, the hardest battles are given to the strongest soldiers. "}
{"fr":"Réagir, c\'est perdre. Un esprit calme est imbattable. ","en":"To react is to lose. A calm mind is unbeatable."}
{"fr":"Plus vos objectifs sont grands et clairs, plus votre motivation intérieure est importante","en":"The bigger and clearer your goals, the greater your inner motivation."};Brian Tracy
{"fr":"N\'arrête pas quand tu es fatigué, arrête quand tu as terminé. ","en":"Don\'t stop when you\'re tired, stop when you\'re finished."}
{"fr":"Le moment où vous abandonnez, c\'est le moment où vous laissez quelqu\'un d\'autre gagner.","en":"The moment you give up, is the moment you let someone else win."};Kobe Bryant
{"fr":"Il est facile d\'être motivé lorsque tout va bien. L\'objectif est de rester discipliné dans les moments difficiles.","en":"It\'s easy to be motivated when everything is going well. The goal is to stay disciplined when things get tough. "}
{"fr":"Si vous me voyez me battre avec un ours, priez pour l\'ours, c\'est la mentalité Mamba.","en":"If you see me in a fight with a bear, pray for the bear, that\'s Mamba mentality. "};Kobe Bryant
{"fr":"Vous n\'allez pas maîtriser le reste de votre vie en un jour. Détendez-vous, maîtrisez votre journée. Et continuez à le faire chaque jour.","en":"You\'re not going to master the rest of your life in one day. Just relax, master the day. Then just keep doing that every day. "}
{"fr":"Il ne s\'agit pas du nombre d\'heures de pratique, mais du nombre d\'heures de présence de l\'esprit pendant la pratique.","en":"It\'s not about the number of hours you practice, it\'s about the number of hours your mind is present during the practice. "};Kobe Bryant
{"fr":"La vie est courte. Vous avez la possibilité de faire la différence dans ce monde. Faites en sorte qu\'elle compte.","en":"Life is short. You have an opportunity right now to make a difference in this world. Make it count. "}
{"fr":"Le plus important est d\'essayer d\'aider et d\'inspirer les gens afin qu\'ils deviennent doués dans ce qu\'ils veulent faire. ","en":"The most important thing is to try and inspire people so then can be great in whatever they want to do. "};Kobe Bryant
{"fr":"Ne remettez pas à plus tard ce que vous pouvez commencer dès maintenant.","en":"Don\'t delay what you can begin right now. "}
{"fr":"Rêver grand. Rien n\'est hors de portée.","en":"Dream big. There is nothing out of reach. "}
{"fr":"Si vous ne croyez pas en vous, personne ne le fera.","en":"If you don\'t believe in yourself, nobody else will. "};Kobe Bryant
{"fr":"Nous n\'abandonnons pas, nous ne nous effondrons pas, nous ne fuyons pas, nous endurons et nous vainquons.","en":"We don\'t quit, we don\'t cower, we don\'t run, we endure and conquer. "}
{"fr":"Si vous avez peur d\'échouer, vous échouerez probablement.","en":"If you\'re afraid to fail, then you\'re probably going to fail. "};Kobe Bryant
{"fr":"Regardez-moi dans les yeux, je ne suis pas meilleur que vous, j\'ai juste plus faim que vous.","en":"Look into my eyes, I am not better than you, I am just hungrier than you. "}
{"fr":"Pour être un grand champion, vous devez croire que vous êtes le meilleur. Si vous ne l\'êtes pas, faites semblant de l\'être.","en":"To be a great champion, you must believe you are the best. If you\'re not, pretend you are. "}
{"fr":"Nous devons essayer des choses, toutes ne fonctionneront pas, nous ne devons pas nous énerver lorsque nous échouons. Nous devons apprendre, aller de l\'avant et réinventer.","en":"We\'ve got to try things, not all of them will work, we don\'t need to get too upset when we have failures. We need to learn, move on and reinvent. "};James Quincey
{"fr":"Marchez comme un roi. Ou comme si vous n\'aviez rien à foutre de qui est le roi.","en":"Walk like a king. Or like you don\'t give a fuck who\'s the king. "}
{"fr":"Respirez, c\'est juste une mauvaise journée, pas une mauvaise vie.","en":"Breathe, it\'s just a bad day, not a bad life. "}
{"fr":"Les champions visent toujours l\'excellence, peu importe le domaine. ","en":"Champions always strive for excellence, whatever the field."}
{"fr":"Vous ne pouvez pas gagner dans la vie si vous perdez dans votre tête.","en":"You can\'t win in life if you are losing in your mind. "}
{"fr":"Ne répétez pas la même erreur en espérant un nouveau résultat.","en":"Don\'t repeat the same mistake and expect a new result. "}
{"fr":"Trouvez une activité que vous aimez tellement que vous ne pouvez pas attendre le lever du soleil pour la refaire.","en":"Find something you love to do so much, you can\'t wait for the sun to rise to do it all over again."};Chris Gardner
{"fr":"La meilleure chose que j\'ai faite a été de devenir plus discret et de me concentrer sur moi-même.","en":"The best thing I ever did was become more lowkey & focus on myself. "}
{"fr":"Je suis né avec quelque chose en moi qui refuse de se contenter de la moyenne. Je ne sais pas ce que c\'est, mais je suis reconnaissante de l\'avoir.","en":"I was born with something inside me that refuses to settle for average. I don\'t know what it is, but I am grateful I have it. "}
{"fr":"Cette vie vous a été donnée parce que vous êtes assez fort pour la vivre.","en":"You were given this life because you are strong enough to live it. "}
{"fr":"Cela peut prendre un mois, un an ou une décennie. Mais si vous le voulez suffisamment, vous y arriverez.","en":"It may take a month, a year or a decade. But if you want if bad enough, you\'ll make it happen. "}
{"fr":"L\'espoir doit devenir plus fort que la peur. ","en":"Hope must become stronger than fear."}
{"fr":"Parfois, on ne sait pas de quoi on est capable tant qu\'on n\'est pas sorti de sa zone de confort, de gré ou de force.","en":"Sometimes you don\'t know what you\'re capable of until you step out of your comfort zone either by choice or by force. "}
{"fr":"Marchez un kilomètre pour éviter une bataille, mais lorsqu\'elle commence, ne reculez pas d\'un pouce.","en":"Walk a mile to avoid a fight but when one starts don\'t back down an inch. "}
{"fr":"Ne réagis pas impulsivement face à l\'échec. Il suffit juste d\'accepter, réviser ton plan et recommencer autrement. ","en":"Don\'t react impulsively to failure. Just accept it, revise your plan and start again."}
{"fr":"Si les chances ne sont pas en votre faveur, c\'est à vous de les battre. ","en":"If the odds aren\'t in your favor, it\'s up to you to beat them."}
{"fr":"Vous ne pouvez pas voir votre reflet dans de l\'eau bouillante. De même, vous ne pouvez pas voir la vérité dans un état de colère.","en":"You canno\'t see your reflection in boiling water. Similarly you canno\'t see truth in a state of anger. "}
{"fr":"Votre esprit est un champ de bataille. Soyez son commandant et non son soldat.","en":"Your mind is a battlefield. Be it\'s commander not it\'s soldier. "}
{"fr":"Celui qui se maîtrise, maîtrise le monde.","en":"He who masters himself, masters the world. "}
{"fr":"Je pense que les objectifs ne devraient jamais être faciles, ils devraient vous forcer à travailler, même s\'ils sont inconfortables sur le moment.","en":"I think goals should never be easy, they should force you to work, even if they are uncomfortable at the time."};Michael Phelps
{"fr":"Je vais tellement élevé mes performances que ce qui me semblait le sommet deviendra le sol.","en":"I\'m gonna raise the standards so much more, once what was the top will seem like the bottom floor. "}
{"fr":"Faites plus de choses qui vous font oublier de vérifier votre téléphone.","en":"Do more things that make you forget to check your phone. "}
{"fr":"J\'ai appris à me concentrer, à travailler dur et à ne pas abandonner. J\'ai appris que chaque obstacle est en réalité une opportunité.","en":"I learned to focus and work hard and not give up. I learned that every obstacle is really an opportunity. "};Jenna Ushkowitz
{"fr":"Si vous voulez vraiment changer, vous devez passer par des situations inconfortables. Cessez d\'essayer d\'esquiver le processus. C\'est la seule façon de grandir.","en":"If you are serious about change, you have to go through uncomfortable situation. Stop trying to dodge the process. It\'s the only way to grow. "}
{"fr":"Tout finira par s\'arranger. Et si ce n\'est pas le cas, ce n\'est pas encore la fin.","en":"Everything will be fine in the end. And if it isn\'t, it\'s not the end yet. "}
{"fr":"You should get to a point where you\'re so busy improving yourself that you don\'t have time for anyone and anything that disctracts you from your goals. ","en":"You should get to a point where you\'re so busy improving yourself that you don\'t have time for anyone and anything that disctracts you from your goals. "}
{"fr":"Vous êtes payé pour votre valeur, pas pour votre temps.","en":"You get paid for your value, not your time. "}
{"fr":"Si je fais un travail en 30 minutes, c\'est parce que j\'ai passé 10 ans à apprendre comment le faire en 30 minutes. Vous me devez les années, pas les minutes.","en":"If I do a job in 30 minutes it\'s because I spent 10 years learning how to do that in 30 minutes. You owe me for the years, not the minutes. "}
{"fr":"Fermez les yeux et imaginez la meilleure version possible de vous. C\'est la personne que vous êtes vraiment, laissez tomber toute partie de vous qui n\'y croit pas.","en":"Close your eyes and imagine the best version of you possible. That\'s who you really are, let go of any part of you that doesn\'t believe it. "}
{"fr":"Personne ne peut détruire le fer si ce n\'est sa propre rouille. De même, personne ne peut détruire une personne si ce n\'est son propre état d\'esprit.","en":"No one can destroy iron but it\'s own rust. Likewise, none can destroy a person but his own mindset. "}
{"fr":"L\'argent est juste un outil, pas le but.. Le but, c\'est la liberté. ","en":"Money is just a tool, not the goal... The goal is freedom."}
{"fr":"Apprends à anticiper pour mieux faire face aux situations difficiles.","en":"Learn to anticipate and better deal with difficult situations."}
{"fr":"Faites le travail. Chaque jour, vous devez faire quelque chose que vous ne voulez pas faire. Chaque jour. Mettez-vous au défi d\'être mal à l\'aise, de dépasser l\'apathie, la paresse et la peur. Sinon, le lendemain, vous aurez deux choses que vous ne voulez pas faire, puis trois, quatre et cinq.","en":"Do the work. Every day you have to do something you don\'t want to do. Every day. Challenge yourself to be uncomfortable, push past the apathy and laziness and fear. Otherwise, the next day you\'re going to have two things, you don\'t want to do, then three and four and five. "}
{"fr":"Parfois, un roi doit rappeler aux imbéciles pourquoi il est roi.","en":"Sometimes a king has to remind fools why he is king. "}
{"fr":"Votre problème est que vous avez passé toute votre vie à penser qu\'il y avait des règles. Ce n\'est pas le cas.","en":"Your problem is you spent your whole life thinking there are rules. There aren\'t. "}
{"fr":"Si vous me donnez six heures pour abattre un arbre, je passerai les quatre premières heures à aiguiser la hache.","en":"Give me size hours to chop down a tree and I will spend the first four sharpening the axe."};Abraham Lincoln
{"fr":"Entraînez-moi et j\'apprendrai, lancez-moi des défis et je grandirai, croyez en moi et je gagnerai.","en":"Coach me and I will learn, challenge me and I will grow, believe in me and I will win. "}
{"fr":"N\'acceptez jamais la défaite, vous êtes peut-être à un pas de la réussite. ","en":"Never accept defeat, you may be just one step away from success."}
{"fr":"Seuls ceux qui prennent le risque d\'aller trop loin peuvent découvrir jusqu\'où l\'on peut aller.","en":"Only those who will risk going too far can possibly find out how far one can go. "}
{"fr":"La vie m\'a enseigné au moins une chose : si quelqu\'un avance avec confiance en direction de ses rêves et qu\'il s\'efforce de mener l\'existence qu\'il a imaginée, il jouiera d\'une réussite hors du commun.","en":"Life has taught me at least one thing: if you move confidently towards your dreams and strive to lead the life you\'ve imagined, you\'ll enjoy extraordinary success."};Henry David Thoreau
{"fr":"Lorsque nous faisons ce que nous sommes censés faire, l\'argent afflue, des portes sont ouvertes, nous nous sentons utiles et le travail que nous accomplissons nous semble être un jeu.","en":"When we do what we are meant to do, money comes to us, doors open for us, we feel useful, and the work we do feels like play to us. "}
{"fr":"Le secret du changement consiste à concentrer toute son énergie, non pas sur la lutte contre l\'ancien, mais sur la construction du nouveau.","en":"The secret of change is to focus all of your energy, not on fighting the old, but on building the new. "}
{"fr":"Les champions sont présents même lorsqu\'ils n\'en ont pas envie.","en":"Champions show up even when they don\'t feel like it. "}
{"fr":"Il n\'y a pas de concurrence car personne ne peut être à ma place.","en":"There\'s no competition because nobody can be me. "}
{"fr":"Ne gâchez pas votre journée en pensant à votre mauvaise journée d\'hier. Laissez tomber.","en":"Don\'t ruin a good today by thinking about a bad yesterday. Let it go. "}
{"fr":"Dominez dans l\'obscurité. Laissez le monde vous voir grâce aux résultats que vous avez obtenus lorsque personne ne vous regardait.","en":"Dominate in the dark. Let the worl see you from the results you made when no one was watching. "}
{"fr":"La rivière perce le rocher non pas par sa force, mais par sa persévérance. ","en":"The river breaks through the rock not by its strength, but by its perseverance."}
{"fr":"Si tu as le temps de t\'apitoyer, tu as le temps de t\'améliorer. ","en":"If you have time to feel sorry for yourself, you have time to improve."}
{"fr":"Soyez si bon qu\'ils ne peuvent pas vous ignorer.","en":"Be so good they can\'t ignore you. "}
{"fr":"Derrière chaque personne qui réussit, il y a beaucoup d\'années d\'échec.","en":"Behind every successful person there\'s a lot of unsuccessful years. "}
{"fr":"On ne sait jamais à quel point on est fort jusqu\'à ce que la force soit le seul choix possible.","en":"You never know how strong you are until being strong is the only choice you have. "}
{"fr":"Vous ne leur manquez pas quand vous n\'êtes plus là. Vous leur manquez quand vous commencez à faire mieux qu\'eux.","en":"They don\'t miss you when you are gone. They miss you when you start doing better than them. "}
{"fr":"J\'ai essayé d\'être normal une fois. C\'était les deux pires minutes de ma vie.","en":"I tried to be normal once. Worst two minutes of my life. "}
{"fr":"Je ne te souhaite pas bonne chance, je te souhaite de travailler à la hauteur de tes objectifs. ","en":"I\'m not wishing you good luck, I\'m wishing you to work towards your goals."}
{"fr":"Des fois faut juste foncer et ne pas réfléchir. Laisser l\'instinct prendre le dessus sur la stratégie. ","en":"Sometimes you just have to go for it and not think. Let instinct take over from strategy."}
{"fr":"Vous serez toujours en position de gagner si vous êtes capable de faire le travail quand vous n\'en avez pas envie.","en":"You\'ll always be in a position to win if you can do the work when you don\'t feel like it. "}
{"fr":"Soyez intelligents, personne ne se soucie de vos efforts, seuls les résultats comptent.","en":"Be smart, no one cares about your efforts, only the results. "}
{"fr":"Travaillez jusqu\'à ce que vos idoles deviennent vos rivaux.","en":"Work until your idols become your rivals. "}
{"fr":"Tout le monde vous aime jusqu\'à ce que vous deveniez un concurrent.","en":"Everybody loves you until you become the competition. "}
{"fr":"Soyez accro à votre passion au lieu de vous laisser distraire.","en":"Be addicted to your passion instead of distraction. "}
{"fr":"Plus vous êtes affamés, plus vous gagnerez vite. ","en":"The hungrier you are, the faster you\'ll win."}
{"fr":"S\'ils peuvent le faire. Vous pouvez le faire. Si l\'un d\'entre nous peut le faire, nous pouvons tous le faire.","en":"If they can do it. You can do it. If one of us can do it, we all can do it. "}
{"fr":"Vous devez faire en sorte qu\'il soit amusant et agréable dans votre esprit de vous lever et de faire les choses difficiles.","en":"You have to make it fun and enjoyable in your own mind to get up and do the hard things. "}
{"fr":"Ne courez pas après les gens. Soyez un exemple. Attirez-les. Travaillez dur et soyez vous-même. Les personnes qui ont besoin de vous dans votre vie viendront vous trouver et resteront. Faites ce que vous avez à faire.","en":"Don\'t chase people. Be an example. Attract them. Work hard and be yourself. The people who beling in your life will come find you and stay. Just do your thing. "}
{"fr":"Je pense que la dépression est légitime. Mais je crois aussi que si vous ne faites pas d\'exercice, si vous ne mangez pas des aliments nutritifs, si vous ne vous exposez pas au soleil, si vous ne dormez pas suffisamment, si vous ne consommez pas de choses positives, si vous ne vous entourez pas de soutien, alors vous ne vous donnez pas une chance de vous en sortir.","en":"I believe depression is legitimate. But I also believe that if you don\'t exercise, eat nutritious food, get sunlight, get enough sleep, consume positive material, surround yourself with support, then you aren\'t giving yourself a fighting chance."};Jim Carrey
{"fr":"Les rêves se réalisent que si vous êtes prêt à vous mettre au travail.","en":"Dreams only come true if you\'re willing to put in the work."}
{"fr":"C\'est toi contre toi. Tous les jours. Depuis toujours.","en":"It\'s You vs You. Everyday. Always has been. "}
{"fr":"Soyez heureux avec ce que vous avez, tout en travaillant pour ce que vous voulez.","en":"Be happy with what you have, while working for what you want. "}
{"fr":"Je ne suis pas ici pour jouer à des jeux. Je suis ici pour dominer.","en":"I\'m not here to just play games. I\'m here to dominate. "}
{"fr":"La réussite ce n\'est pas juste faire de l\'argent, c\'est de vivre ta propre vie comme tu l\'entends. ","en":"Success isn\'t just about making money, it\'s about living your own life the way you want to."}
{"fr":"Je n\'ai qu\'un seul pouvoir, celui de ne jamais abandonner.","en":"I have one power, I never give up. "}
{"fr":"La peur est stupide, les regrets aussi.","en":"Fear is stupid, so are regrets. "}
{"fr":"Il va arriver un moment où vous faites tellement plus d\'efforts que la plupart des gens, que vous allez vous sentir méritant d\'obtenir ce nouveau style de vie.","en":"There\'s going to come a time when you\'re trying so much harder than most people, that you\'re going to feel worthy of getting this new lifestyle."}
{"fr":"Si tu sais pourquoi tu te lève chaque matin, continue comme ça. Si ce n\'est pas le cas, il est temps de changer quelque chose. ","en":"If you know why you get up every morning, keep it up. If not, it\'s time to change something."}
{"fr":"On ne commence pas tous avec les mêmes capacités. Mais tout le monde peut le faire. ","en":"We don\'t all start with the same abilities. But everyone can do it."}
{"fr":"Le processus de changement nécessite un désapprentissage. Cela nécessite de rompre avec l\'habitude de l\'ancien soi et de réinventer un nouveau soi.","en":"The process of change requires unlearning. It requires breaking the habit of the old self and reinventing a new self. "}
{"fr":"Steve Harvey a dit ce matin : \'si vous traversez l\'enfer, continuez. Pourquoi vous arrêteriez-vous EN enfer ?\' et ça m\'a ému.","en":"Steve Harvey said this morning, \'if you\'re going through hell, keep going, Why would you stop IN hell ?\' and that moved me. "}
{"fr":"Notre plus grande faiblesse réside dans l\'abandon. la façon la plus sûre de réussir est d\'essayer une autre fois. ","en":"Our greatest weakness lies in giving up. the surest way to succeed is to try again."};Thomas A. Edison
{"fr":"C\'est sage de réfléchir, encore mieux de planifier, mais le mieux c\'est de le faire.","en":"Thinking well is wise. Planning well is wiser. Doing well is wisest. "}
{"fr":"Personne ne se soucis de votre histoire jusqu\'à ce que vous gagnez, alors gagnez. ","en":"Nobody cares about your story until you win, then win."}
{"fr":"C\'est toi contre toi. Chaque. Jour.","en":"It\'s you vs you. Every. Single. Day. "}
{"fr":"Celui qui tombe et se relève est bien plus fort que celui qui n\'est jamais tombé.","en":"The one who falls and gets back up is much stronger than the one who never fell. "}
{"fr":"La manière la plus efficace d\'y parvenir est de le faire.","en":"The most effective way to do it is to do it. "}
{"fr":"Ne vous arrêtez pas tant que vous n\'êtes pas fier de vous.","en":"Don\'t stop until you are proud of yourself. "}
{"fr":"Ils veulent vous voir être bon, mais jamais mieux qu\'eux. Rappelez-vous cela.","en":"They want to see you do good, but never better than them. Remember that. "}
{"fr":"Personne n\'a jamais écrit un plan pour être fauché, gros, paresseux ou stupide. Ces choses arrivent quand on n\'a pas de plan.","en":"Nobody ever wrote down a plan to be broke, fat, lazy or stupid. Those things are what happen when you don\'t have a plan. "};Larry Winget
{"fr":"Concentrez-vous et faites-le.","en":"Just focus and do it. "}
{"fr":"Tous ceux que vous rencontrez mènent une bataille dont vous ne savez rien. Soyez gentil. Toujours.","en":"Everyone you meet is fighting a battle you know nothing about. Be kind. Always. "}
{"fr":"Des merdes arrivent. Tous les jours. À tout le monde. La différence réside dans la façon dont nous réagissons.","en":"Shit happens. Every day. To everyone. The difference is how we respond. "}
{"fr":"Soyez l\'un des rares à faire ce qu\'ils disent.","en":"Be one of the few who do what they say. "}
{"fr":"Le succès est un mauvais professeur. Il fait croire aux gens intelligents qu\'ils ne peuvent pas perdre.","en":"Success is a lousy teacher. It seduces smart people into thinking they can\'t lose. "}
{"fr":"L\'homme appartient à ces espèces d\'animaux qui, une fois blessés, peuvent devenir particulièrement féroces. ","en":"Man belongs to those species of animals which, once injured, can become particularly ferocious."}
{"fr":"N\'ose pas abandonner ce rêve ! Votre vie peut passer de 0 à 100 très rapidement. Accrochez-vous..","en":"Don\'t you dare give up on that dream ! Your life can go from 0 to 100 real quick. Hang in there.. "}
{"fr":"L\'homme qui se maîtrise par l\'autodiscipline ne pourra jamais être maîtrisé par les autres.","en":"The man that masters himself through self-discipline can never be mastered by others. "}
{"fr":"Le vrai changement n\'est pas facile. Doutez, essayez, échouez mais n\'abandonnez jamais.","en":"Real change is not easy. Doubt, try, fail but never give up. "}
{"fr":"Il n\'y a pas de secret. Je fais ce qu\'il y a à faire parce que je m\'estime et que je me fixe des objectifs.","en":"There\'s no secret. I just get shit done because I value myself and my goals. "}
{"fr":"Plus le jardin est beau, plus les mains du jardinier sont sales.","en":"The prettier the garden, the dirtier the hands of the gardener. "}
{"fr":"Il vaut mieux exceller dans une seule discipline que d\'être médiocre dans plusieurs. ","en":"It\'s better to excel in one discipline than to be mediocre in many."}
{"fr":"La peur est temporaire, les regrets durent toute une vie. ","en":"Fear is temporary, regret lasts a lifetime."}
{"fr":"La merde dans votre vie est le meilleur engrais pour vous aider à grandir.","en":"The shit in your life is the best fertilizer to help you grow. "}
{"fr":"Faites comme si vous n\'aviez pas d\'amis et travaillez comme si personne ne vous soutenait.","en":"Hustle like you have no friends and grind like nobody has you back. "}
{"fr":"Les gagnants n\'ont pas de chance, ils travaillent simplement plus dur que vous.","en":"Winners are not lucky, they just work harder than you. "}
{"fr":"Quand tu ressens de la difficulté, rappelle toi qu\'il n\'y a pas de progrès sans efforts, et que ce moment inconfortable fera du toi de demain quelqu\'un de meilleur. ","en":"When you\'re having trouble, remember that there\'s no progress without effort, and that this uncomfortable moment will make tomorrow\'s you a better person."}
{"fr":"Le stress vous fait penser que tout doit être réglé tout de suite. Respirez, réglez le problème petit à petit.","en":"Stress makes you think that everything needs to be fixed right now. Breathe, fix it step by step. "}
{"fr":"La vie ne consiste pas à être meilleur que quelqu\'un d\'autre, mais à être meilleur que ce que l\'on était et à devenir ce que l\'on est.","en":"Life is not about being better than someone else, it\'s about being better than you used to be and becoming who you are. "}
{"fr":"Personne n\'arrive au sommet sans échouer... Ils vont certainement tout faire foirer, mais ils vont aussi tout faire péter. Il faut s\'attendre à ce qu\'il y ait des dos d\'âne et en être reconnaissant.","en":"Nobody gets to the top without failing.. They\'ll screw it up for sure, but they\'ll also knock it out of the park. Expect the speedbumbs and be grateful for them. "};Jen Sincero
{"fr":"Montrez l\'exemple. Vous ne savez jamais qui vous admire.","en":"Set the example. You never know who is looking up to you. "}
{"fr":"Lorsque l\'élève est prêt, le maître apparaît.","en":"When the student is ready, the master appears."}
{"fr":"Si vous voulez gagner le jeu de la vie, vous devez d\'abord définir ce qu\'est la victoire. ","en":"If you want to win the game of life. You first have to deinf what winning is. "}
{"fr":"Ce n\'est pas parce que je vous donne des conseils que j\'en sais plus que vous. Cela signifie simplement que j\'ai fait plus de conneries.","en":"Just because I give you advice doesn\'t mean I know more than you. It just means I\'ve done more stupid shit. "}
{"fr":"Plus vous travaillez dur pour obtenir quelque chose, plus vous vous sentirez bien lorsque vous y parviendrez.","en":"The harder you work for something the greater you\'ll feel when you achieve it. "}
{"fr":"Regardez vos 5 amis les plus proches. Ces 5 amis sont qui vous êtes. Si vous n\'aimez pas qui vous êtes, vous savez ce qu\'il vous reste à faire.","en":"Look at your 5 closest friends. Those 5 friends are who you are. If you don\'t like who you are then you know what you have to do. "};Will Smith
{"fr":"Écoutez, souriez, acceptez, puis faites ce que vous aviez l\'intention de faire de toute façon.","en":"Listen, smile, agree, and then do whatever the fuck you were gonna do anyway. "}
{"fr":"Le meilleur conseil que je puisse vous donner est d\'être actif. Beaucoup de gens parlent de ce qu\'ils veulent faire et se contentent de mots. Mettez des actes derrière vos paroles. Ne soyez pas un parleur, soyez un acteur.","en":"The best tip I can give you is to be active. So manye people talk about what they want to do & they just love words. Put actions behind your words. Don\'t be a talker, be a doer. "};Kevin Hart
{"fr":"Personne ne viendra te sauver. Lève-toi. Sois ton propre héros.","en":"Nobody is coming to save you. Get up. Be your own hero. "}
{"fr":"La seule chose qui se dresse entre vous et votre rêve, c\'est la volonté d\'essayer et la conviction qu\'il est réellement possible. ","en":"The only thing standing between you and your dream is the will to try, and the conviction that it really is possible."}
{"fr":"Arrêtez de chercher la facilité. Rien de ce qui vaut la peine d\'être acquis n\'est jamais facile.","en":"Stop searching for the easy way out. Nothing worth having ever comes easy. "}
{"fr":"Il est plus difficile d\'être régulier lorsque personne ne vous applaudit. Vous devez vous applaudir vous-même dans ces moments-là, vous devez toujours être votre plus grand supporter.","en":"Consistency is harder when no one is clapping for you. You must clap for yourself during those times, you should always be your biggest supporter."};Damian Marley
{"fr":"Un oiseau assis sur un arbre n\'a jamais peur que la branche se brise, car il ne se fie pas à la branche, mais à ses propres ailes.","en":"A bird sitting on a tree is never afraid of the branch breaking because its trust is not on the branch but on its own wings. "}
{"fr":"Le travail et le désir sont les deux composants les plus importants du succès. ","en":"Hard work and desire are the two most important components of success."}
{"fr":"Je ne vous ignore pas, je suis occupé à construire mon empire.","en":"I\'m not ignoring you, I\'m busy building my empire. "}
{"fr":"Travaillez pour obtenir ce résultat plus que vous n\'en parlez.","en":"Work for it more than you talk about it. "}
{"fr":"Il a y de la grandeur en chacun de nous. ","en":"There\'s greatness in all of us."}
{"fr":"La meilleure chose que vous puissiez faire est de sortir de votre zone de confort. Soyez seul. Partez de zéro. Acceptez d\'être fauché. Vous ne saurez pas de quoi vous êtes capable tant que vous n\'aurez pas repoussé vos limites.","en":"The best thing you can ever do is step out of your comfort zone. Be alone. Start from zero. Embrace being broke. You won\'t know what you\'re capable of until you push your limits. "}
{"fr":"Si vous pensez que vous êtes trop petit pour changer quelque chose. Essayez donc de dormir avec un moustique dans votre chambre et vous verrez lequel des deux empêche l\'autre de dormir. ","en":"If you think you\'re too small to change anything. Try sleeping with a mosquito in your room and see which one keeps the other awake."};Dalaï-Lama
{"fr":"L\'intelligence n\'est pas affaire de diplômes. Elle peut aller avec mais ce n\'est pas son élément premier. L\'intelligence est la force, solitaire, d\'extraire du chaos de s apropre vie la poignée de lumière suffisante pour éclairer un peu plus loin que soi - vers l\'autre là-bas, comme nous égaré dans le noir. ","en":"Intelligence is not a matter of diplomas. It may go with it, but it\'s not its primary element. Intelligence is the solitary strength to extract from the chaos of one\'s own life the handful of light sufficient to illuminate a little further than oneself - towards the other out there, like us, lost in the dark."};Christian Bobin
{"fr":"Nous travaillons toujours pour des lendemains meilleurs. Mais quand le lendemain arrive, au lieu d\'en profiter, nous pensons encore à un lendemain meilleur. Faisons en sorte que notre journée soit meilleure !","en":"We always work for a better tomorrow. But when tomorrow comes, instead of enjoying, we again think of a better tomorrow. Let\'s have a better today!"}
{"fr":"Arrête de vouloir te motiver. Soit tu te plains soit tu te mets au boulot. ","en":"Stop trying to motivate yourself. Either complain or get to work."}
{"fr":"La confiance en soi est ce qui vous permet de vous démarquer.","en":"Confidence is what makes you stand out. "}
{"fr":"Je suis en train de devenir la meilleure version de moi-même.","en":"I am in the process of becoming the best version of myself. "}
{"fr":"N\'ayez pas honte de votre travail ou de vos efforts. Personne ne vous nourrira si vous êtes fauché.","en":"Don\'t be ashamed of your work or hustle. Nobody will feed you if you go broke. "}
{"fr":"Certaines personnes veulent vous voir échouer. Décevez-les.","en":"Some people want to see you fail. Disappoint them. "}
{"fr":"Tout commence par un rêve, tout se concrétise par l\'action. ","en":"It all starts with a dream, and becomes a reality through action."}
{"fr":"Rêve du sommet mais concentre-toi sur la première marche. ","en":"Dream of the summit, but concentrate on the first step."}
{"fr":"En ce moment, les petites victoires comptent vraiment. Aller courir alors qu\'on pourrait facilement se détendre sur le canapé. Manger sainement quand on est entouré de nourriture. Prendre un livre alors que Netflix est à portée de clic. Lorsque vous êtes coincé à la maison, les petites victoires vous définissent plus qu\'elles ne l\'ont jamais fait.","en":"Right now, small wins really matter. Going for a run when you could easily relax on the couch. Eating clean when you\'re surrounded by food. Picking up a book when Netflix is one click away. When you\'re stuck at home, the small wins define you more than they ever have."}
';

if (!isset($action)) {
    $db->AddLog(0, 0, 'cheatSuspicion', 'Test.php called without action');
    exit(0);
}

if ($action == 'totaux') {
    $skills = GetSkills($db);
    $ref = isset($_GET['not']) ? intval($_GET['not']) : -1;
    for ($s = 0; $s < count($skills); $s++) {
        $name = $skills[$s]['Name']->fr;
        $total = 0;
        foreach ($skills[$s]['Stats'] as $key => $value) {
            $total += intval($value);
        }
        if ($total != $ref) {
            echo("$name : $total<br />");
        }
    }
}

else if ($action == 'compWithoutCreator') {
    $skills = GetSkills($db);
    for ($s = 0; $s < count($skills); $s++) {
        $Name = $skills[$s]['Name'];
        $Creator = $skills[$s]['Creator'];
        if (empty($Creator)) {
            echo("$Name<br />");
        }
    }
}

else if ($action == 'compWithCreator') {
    $skills = GetSkills($db);
    for ($s = 0; $s < count($skills); $s++) {
        $Name = $skills[$s]['Name'];
        $Creator = $skills[$s]['Creator'];
        if (!empty($Creator)) {
            echo("$Name<br />");
        }
    }
}

else if ($action === 'giveAllTo') {
    $id = $_GET['id'];
    $db->AddLog(0, 0, 'cheatSuspicion', "Give all items to $id");

    // Get account
    if (!$id) exit('Account id not defined!');
    $account = Accounts::GetByID($db, $id);
    if ($account === null) exit('Account not found!');

    // Get all items
    $items = $db->QueryPrepare('Items', 'SELECT `ID` FROM TABLE');
    if ($items === false || count($items) === 0) exit('Items not found!');
    $items = array_map(fn($row) => $row['ID'], $items);

    // Add all in inventory
    $command = 'INSERT INTO TABLE (`AccountID`, `ItemID`, `CreatedBy`) VALUES (?, ?, ?)';
    foreach ($items as $item) {
        $result = $db->QueryPrepare('Inventories', $command, 'isi', [ $account->ID, $item, $account->ID ]);
        if ($result === false) exit("Add $item in account {$account->ID}: Failed");
    }
}

else if ($action === 'addQuotes') {
    // Split quotes
    $quotes = explode("\n", $quotesRaw);
    if ($quotes === false) exit('Failed to split quotes');

    // Empty table
    $result = $db->QueryPrepare('Quotes', 'DELETE FROM TABLE');
    if ($result === false) exit('Empty table: Failed');

    // Reset auto increment
    $result = $db->QueryPrepare(null, 'ALTER TABLE `Quotes` AUTO_INCREMENT = 1');
    if ($result === false) exit('Reset auto increment: Failed');

    // Add quotes
    $command = 'INSERT INTO TABLE (`Quote`, `Author`) VALUES (?, ?)';
    foreach ($quotes as $quote) {
        echo("Add quote $quote<br />");
        $quoteContent = explode(';', $quote);
        if ($quoteContent === false) exit('Failed to split quote');
        if (count($quoteContent) !== 1 && count($quoteContent) !== 2) {
            print_r($quoteContent);
            exit('Quote not valid');
        }

        $text = json_decode($quoteContent[0], true);
        print_r($text); echo('<br />');
        $text_fr = trim(mb_convert_encoding($text['fr'], 'UTF-8'));
        $text_en = trim(mb_convert_encoding($text['en'], 'UTF-8'));
        print_r($text_fr); echo('<br />');

        $author = count($quoteContent) === 2 ? trim($quoteContent[1]) : '';
        $newText = array(
            'fr' => $text_fr,
            'en' => $text_en
        );
        echo("New text "); print_r($newText); echo('<br />');

        $newQuote = array(
            json_encode($newText, JSON_UNESCAPED_UNICODE),
            $author
        );
        $result = $db->QueryPrepare('Quotes', $command, 'ss', $newQuote);
        if ($result === false) exit("Add quote {$newQuote}: Failed");

        echo("Final quote "); print_r(json_encode($newQuote, JSON_UNESCAPED_UNICODE)); echo('<br />');
    }

    echo('Done');
}

?>
