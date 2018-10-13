
interface Crud<T>{
    crear():void
    Leer():T
    actualizar(entidad:T):void
    eliminar():void

}