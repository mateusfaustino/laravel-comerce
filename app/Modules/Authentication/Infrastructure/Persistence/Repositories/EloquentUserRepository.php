<?php

namespace App\Modules\Authentication\Infrastructure\Persistence\Repositories;

use App\Modules\Authentication\Domain\Entities\User as DomainUser;
use App\Modules\Authentication\Domain\Repositories\UserRepositoryInterface;
use App\Modules\Authentication\Infrastructure\Persistence\Models\EloquentUserModel;
use Carbon\CarbonImmutable;

class EloquentUserRepository implements UserRepositoryInterface
{
    public function findByEmail(string $email): ?DomainUser
    {
        $model = EloquentUserModel::where('email', $email)->first();

        if ($model === null) {
            return null;
        }

        return $this->toDomainEntity($model);
    }

    public function findById(int $id): ?DomainUser
    {
        $model = EloquentUserModel::find($id);

        if ($model === null) {
            return null;
        }

        return $this->toDomainEntity($model);
    }

    public function save(DomainUser $user): DomainUser
    {
        $model = EloquentUserModel::create([
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'password' => $user->getPassword(),
            'role_id' => $user->getRoleId(),
        ]);

        return $this->toDomainEntity($model);
    }

    public function update(DomainUser $user): DomainUser
    {
        $model = EloquentUserModel::findOrFail($user->getId());

        $model->update([
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'role_id' => $user->getRoleId(),
        ]);

        return $this->toDomainEntity($model->fresh());
    }

    private function toDomainEntity(EloquentUserModel $model): DomainUser
    {
        $user = new DomainUser(
            name: $model->name,
            email: $model->email,
            password: $model->getRawOriginal('password'),
            roleId: $model->role_id,
        );

        $user->setId($model->id);

        if ($model->email_verified_at !== null) {
            $user->setEmailVerifiedAt(CarbonImmutable::parse($model->email_verified_at));
        }

        if ($model->created_at !== null) {
            $user->setCreatedAt(CarbonImmutable::parse($model->created_at));
        }

        if ($model->updated_at !== null) {
            $user->setUpdatedAt(CarbonImmutable::parse($model->updated_at));
        }

        return $user;
    }
}
