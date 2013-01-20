define(
  ['require', 'singleton', 'actores/actor', 'actores/aceituna', 'actores/texto', 'mootools'],
  function(require, singleton, actor, actor_aceituna, actor_texto, mootools){
    return {
      Actor: actor.Actor,
      Aceituna: actor_aceituna.Aceituna,
      Texto: actor_texto.Texto
    };
  }
);
